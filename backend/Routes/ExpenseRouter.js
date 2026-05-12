const express = require('express');
const { getAllTransactions, addTransaction, deleteTransaction, getInsights }
    = require('../Controllers/ExpenseController');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth');

router.get('/', getAllTransactions);
router.post('/', addTransaction);
router.delete('/:expenseId', deleteTransaction);
router.get('/insights', ensureAuthenticated, getInsights);

module.exports = router;