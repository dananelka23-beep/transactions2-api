const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/database");

const COLLECTION_NAME = "transactions";

const validCardTypes = ["Visa", "Master", "Amex", "Discover", "Other"];

function getCollection() {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME);
}

function validateTransaction(body) {
  if (!body.creditCardNickname) {
    return "creditCardNickname is required.";
  }

  if (!body.cardType) {
    return "cardType is required.";
  }

  if (!validCardTypes.includes(body.cardType)) {
    return "Invalid card type.";
  }

  if (!body.date) {
    return "date is required.";
  }

  if (Number.isNaN(Date.parse(body.date))) {
    return "Invalid date.";
  }

  if (body.amount === undefined) {
    return "amount is required.";
  }

  if (typeof body.amount !== "number") {
    return "amount must be numeric.";
  }

  return null;
}

function buildTransaction(body) {
  return {
    creditCardNickname: body.creditCardNickname,
    cardType: body.cardType,
    date: new Date(body.date),
    amount: body.amount,
    amendment: body.amendment === true,
    comment: body.comment || null,
    createdAt: new Date()
  };
}

async function createTransaction(body) {
  const validationError = validateTransaction(body);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const transaction = buildTransaction(body);

  const result = await getCollection().insertOne(transaction);

  return {
    ...transaction,
    _id: result.insertedId
  };
}

async function findTransactions(query) {
  const filter = {};

  const { date, startDate, endDate, creditCardNickname } = query;

  if (creditCardNickname) {
    filter.creditCardNickname = creditCardNickname;
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);

    end.setDate(end.getDate() + 1);

    filter.date = {
      $gte: start,
      $lt: end
    };
  }

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      filter.date.$lt = end;
    }
  }

  return getCollection()
    .find(filter)
    .sort({ date: -1 })
    .toArray();
}

async function findTransactionById(id) {
  if (!ObjectId.isValid(id)) {
    const error = new Error("Invalid id.");
    error.statusCode = 400;
    throw error;
  }

  const transaction = await getCollection().findOne({
    _id: new ObjectId(id)
  });

  return transaction;
}

module.exports = {
  validCardTypes,
  createTransaction,
  findTransactions,
  findTransactionById
};