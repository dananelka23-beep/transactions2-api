const Transaction = require("../models/transactionModel");

async function createTransaction(req, res, next) {
  try {
    const transaction = await Transaction.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}

async function getTransactions(req, res, next) {
  try {
    const transactions = await Transaction.findTransactions(req.query);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

async function getTransactionById(req, res, next) {
  try {
    const transaction = await Transaction.findTransactionById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found."
      });
    }

    res.json(transaction);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById
};