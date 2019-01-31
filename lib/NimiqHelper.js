const Nimiq = require('@nimiq/core');
const Observable = Nimiq.Observable;
// const TagCache = require('redis-tag-cache');
// const Cache = new TagCache.default();

const {
    NIMIQ_NETWORK = 'main',
    NIMIQ_PROTOCOL = 'dumb',
    NIMIQ_PORT,
    DOMAIN_NAME,
} = process.env;

class NimiqHelper extends Observable {
    async connect() {
        this.$ = {};
        this.$.established = false;
        Nimiq.GenesisConfig[NIMIQ_NETWORK].call(this);

        let networkConfig;
        switch (NIMIQ_PROTOCOL) {
            case 'wss':
                networkConfig = new Nimiq.WssNetworkConfig(DOMAIN_NAME, NIMIQ_PORT, config.tls.key, config.tls.cert, config.reverseProxy);
                break;
            case 'ws':
                networkConfig = new Nimiq.WsNetworkConfig(DOMAIN_NAME, NIMIQ_PORT, config.reverseProxy);
                break;
            case 'dumb':
                networkConfig = new Nimiq.DumbNetworkConfig();
                break;
        }

        Log.i("Connecting to Nimiq Network: " + NIMIQ_NETWORK + ' Protocol:' + NIMIQ_PROTOCOL);
        this.$.consensus = await Nimiq.Consensus.full(networkConfig);
        if (NIMIQ_NETWORK !== 'main') {
            Log.w(`----- YOU ARE CONNECTING TO ${ NIMIQ_NETWORK.toUpperCase() }NET -----`);
        }
        this.$.blockchain = this.$.consensus.blockchain;
        this.$.mempool = this.$.consensus.mempool;
        this.$.network = this.$.consensus.network;
        this.$.accounts = this.$.blockchain.accounts;
        this.$.consensus.on('established', () => this._onConsensusEstablished(this.$));
        this.$.consensus.on('lost', () => {
            this.$.established = false;
        });
        this.$.blockchain.on('head-changed', (head) => this._onHeadChanged(head));

        this.$.network.connect();

        this.$.isEstablished = this.isEstablished.bind(this);
        this.$.getHeight = this._getHeight.bind(this);
        return this;
    }


    isEstablished() {
        this.$.established;
    }

    _onConsensusEstablished() {
        this.$.established = true;
    }

    async _onHeadChanged(head) {
        Log.i(NimiqHelper, "Head changed to:" + this.$.blockchain.height);
        // if (head.body.transactions.length > 0) {
        //     for (let tx of head.body.transactions) {
        //         Cache.invalidate(tx.recipient.toHex(), tx.sender.toHex());
        //     }
        // }
    }

    _getHeight() {
        return this.$.blockchain.height;
    }

    /**
     * Transactions
     */

    async createRawTransaction(tx) {
        const from = Nimiq.Address.fromString(tx.from);
        const fromType = tx.fromType ? Number.parseInt(tx.fromType) : Nimiq.Account.Type.BASIC;
        const to = Nimiq.Address.fromString(tx.to);
        const toType = tx.toType ? Number.parseInt(tx.toType) : Nimiq.Account.Type.BASIC;
        const value = parseInt(tx.value);
        const fee = parseInt(tx.fee);
        const flags = tx.flags ? Number.parseInt(tx.flags) : Nimiq.Transaction.Flag.NONE;
        const data = tx.data ? Nimiq.BufferUtils.fromHex(tx.data) : null;
        /** @type {Wallet} */
        const wallet = await this._walletStore.get(from);
        if (!wallet || !(wallet instanceof Nimiq.Wallet)) {
            throw new Error(`"${tx.from}" can not sign transactions using this node.`);
        }
        let transaction;
        if (fromType !== Nimiq.Account.Type.BASIC) {
            throw new Error('Only transactions from basic accounts may be created using this function.');
        } else if (toType !== Nimiq.Account.Type.BASIC || data !== null) {
            transaction = new Nimiq.ExtendedTransaction(from, fromType, to, toType, value, fee, this._blockchain.height, flags, data);
            transaction.proof = Nimiq.SignatureProof.singleSig(wallet.publicKey, Nimiq.Signature.create(wallet.keyPair.privateKey, wallet.publicKey, transaction.serializeContent())).serialize();
        } else {
            transaction = wallet.createTransaction(to, value, fee, this._blockchain.height);
        }
        return Nimiq.BufferUtils.toHex(transaction.serialize());
    }

    async _getTransactionByHash(hash) {
        const entry = await this.$.blockchain.getTransactionInfoByHash(hash);
        if (entry) {
            const block = await this.$.blockchain.getBlock(entry.blockHash, /*includeForks*/ false, /*includeBody*/ true);
            return this._transactionToObj(block.transactions[entry.index], block, entry.index);
        }
        const mempoolTx = this.$.mempool.getTransaction(hash);
        if (mempoolTx) {
            return this._transactionToObj(mempoolTx);
        }
        return null;
    }


    async getAccountTransactions(address, limit = 500) {
        const receipts = await this.$.blockchain.getTransactionReceiptsByAddress(address, limit);
        const result = [];
        for (const r of receipts) {
            result.push(await this._getTransactionByHash(r.transactionHash));
        }
        result.sort(function (a, b) {
            if (a.blockNumber < b.blockNumber) {
                return -1;
            }
            if (a.blockNumber > b.blockNumber) {
                return 1;
            }
            return 0
        });

        return result;
    }

    async getTransactionByHash(hash) {
        return this._getTransactionByHash(Nimiq.Hash.fromString(hash));
    }

    sendTx(tx) {
        return this.$.consensus.mempool.pushTransaction(tx);
    }

    async getTransactionByHash(hash) {
        return this._getTransactionByHash(Nimiq.Hash.fromString(hash));
    }

    async _getTransactionByHash(hash) {
        const entry = await this.$.blockchain.getTransactionInfoByHash(hash);
        if (entry) {
            const block = await this.$.blockchain.getBlock(entry.blockHash, /*includeForks*/ false, /*includeBody*/ true);
            return this._transactionToObj(block.transactions[entry.index], block, entry.index);
        }
        const mempoolTx = this.$.mempool.getTransaction(hash);
        if (mempoolTx) {
            return this._transactionToObj(mempoolTx);
        }
        return null;
    }

    _transactionToObj(tx, block, i) {
        return {
            hash: tx.hash().toHex(),
            blockHash: block ? block.hash().toHex() : undefined,
            blockNumber: block ? block.height : undefined,
            timestamp: block ? block.timestamp : undefined,
            confirmations: block ? this.$.blockchain.height - block.height + 1 : 0,
            transactionIndex: i,
            from: tx.sender.toHex(),
            fromAddress: tx.sender.toUserFriendlyAddress(),
            to: tx.recipient.toHex(),
            toAddress: tx.recipient.toUserFriendlyAddress(),
            value: tx.value,
            fee: tx.fee,
            data: Nimiq.BufferUtils.toHex(tx.data) || null,
            flags: tx.flags
        };
    }


    /**
     * Blockchain
     */
    async getBlockByHash(blockHash, includeTransactions) {
        const block = await this.$.blockchain.getBlock(Nimiq.Hash.fromString(blockHash), /*includeForks*/ false, /*includeBody*/ true);
        return block ? this._blockToObj(block, includeTransactions) : null;
    }

    async getBlockByNumber(number, includeTransactions) {
        const block = await this._getBlockByNumber(number);
        return block ? this._blockToObj(block, includeTransactions) : null;
    }

    _getBlockByNumber(number) {
        if (typeof number === 'string') {
            if (number.startsWith('latest-')) {
                number = this._blockchain.height - parseInt(number.substring(7));
            } else if (number === 'latest') {
                number = this._blockchain.height;
            } else {
                number = parseInt(number);
            }
        }
        if (number === 0) number = 1;
        if (number === 1) return Promise.resolve(Nimiq.GenesisConfig.GENESIS_BLOCK);
        return this.$.blockchain.getBlockAt(number, /*includeBody*/ true);
    }


    async _blockToObj(block, includeTransactions = false) {
        return {
            number: block.height,
            hash: block.hash().toHex(),
            pow: (await block.pow()).toHex(),
            parentHash: block.prevHash.toHex(),
            nonce: block.nonce,
            bodyHash: block.bodyHash.toHex(),
            accountsHash: block.accountsHash.toHex(),
            miner: block.minerAddr.toHex(),
            minerAddress: block.minerAddr.toUserFriendlyAddress(),
            difficulty: block.difficulty,
            extraData: Nimiq.BufferUtils.toHex(block.body.extraData),
            size: block.serializedSize,
            timestamp: block.timestamp,
            transactions: includeTransactions
                ? block.transactions.map((tx, i) => this._transactionToObj(tx, block, i))
                : block.transactions.map((tx) => tx.hash().toHex())
        };
    }

    /**
     * Network
     */
    getPeerList(){
        let peers = [];
        for (const peerAddressState of this.$.network.addresses.iterator()) {
            peers.push(this._peerAddressStateToPeerObj(peerAddressState));
        }
        return peers;
    }

    _peerAddressStateToPeerObj(peerAddressState, connection) {
        if (!peerAddressState) return null;
        if (!connection) connection = this.$.network.connections.getConnectionByPeerAddress(peerAddressState.peerAddress);
        const peerAddress = connection && connection.peer && connection.peer.peerAddress ? connection.peer.peerAddress : peerAddressState.peerAddress;
        return {
            id: peerAddress.peerId ? peerAddress.peerId.toHex() : null,
            address: peerAddress.toString(),
            failedAttempts: peerAddressState.failedAttempts,
            addressState: peerAddressState.state,
            connectionState: connection ? connection.state : undefined,
            version: connection && connection.peer ? connection.peer.version : undefined,
            timeOffset: connection && connection.peer ? connection.peer.timeOffset : undefined,
            headHash: connection && connection.peer ? connection.peer.headHash.toHex() : undefined,
            score: connection ? connection.score : undefined,
            latency: connection ? connection.statistics.latencyMedian : undefined,
            rx: connection && connection.networkConnection ? connection.networkConnection.bytesReceived : undefined,
            tx: connection && connection.networkConnection ? connection.networkConnection.bytesSent : undefined
        };
    }

    /**
     * Accounts
     */


    async getAccount(addr) {
        const address = Nimiq.Address.fromString(addr);
        const account = await this.$.blockchain.accounts.get(address);
        return this._accountToObj(account, address);
    }

    async getBalance(addrString, atBlock) {
        if (atBlock && atBlock !== 'latest') throw new Error(`Cannot calculate balance at block ${atBlock}`);
        return (await this._accounts.get(Nimiq.Address.fromString(addrString))).balance;
    }


    _accountToObj(account, address) {
        if (!account) return null;
        const obj = {
            id: address.toHex(),
            address: address.toUserFriendlyAddress(),
            balance: account.balance,
            type: account.type
        };
        if (account instanceof Nimiq.VestingContract) {
            obj.owner = account.owner.toHex();
            obj.ownerAddress = account.owner.toUserFriendlyAddress();
            obj.vestingStart = account.vestingStart;
            obj.vestingStepBlocks = account.vestingStepBlocks;
            obj.vestingStepAmount = account.vestingStepAmount;
            obj.vestingTotalAmount = account.vestingTotalAmount;
        } else if (account instanceof Nimiq.HashedTimeLockedContract) {
            obj.sender = account.sender.toHex();
            obj.senderAddress = account.sender.toUserFriendlyAddress();
            obj.recipient = account.recipient.toHex();
            obj.recipientAddress = account.recipient.toUserFriendlyAddress();
            obj.hashRoot = account.hashRoot.toHex();
            obj.hashCount = account.hashCount;
            obj.timeout = account.timeout;
            obj.totalAmount = account.totalAmount;
        }
        return obj;
    }

    getConsensus() {
        return this.$;
    }


}

module.exports = NimiqHelper;