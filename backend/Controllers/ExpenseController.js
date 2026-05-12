const UserModel = require("../Models/User");

const addTransaction = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body)
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: req.body } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Expense added successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const getAllTransactions = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body)
    try {
        const userData = await UserModel.findById(_id).select('expenses');
        res.status(200)
            .json({
                message: "Fetched Expenses successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Expense Deleted successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}
const getInsights = async (req, res) => {

    try {

        const { _id } = req.user;

        const user = await UserModel.findById(_id);

        const expenses = user.expenses;

        // TOTAL INCOME
        const income = expenses
            .filter(item => item.type === 'income')
            .reduce((acc, item) => acc + item.amount, 0);

        // TOTAL EXPENSE
        const expense = expenses
            .filter(item => item.type === 'expense')
            .reduce((acc, item) => acc + item.amount, 0);

        // BALANCE
        const balance = income - expense;

        let insights = [];

        // HIGH SPENDING WARNING
        if (income > 0 && expense > income * 0.7) {

            insights.push(
                '⚠️ Your expenses are more than 70% of your income.'
            );
        }

        // GOOD SAVINGS
        if (balance > income * 0.3) {

            insights.push(
                '✅ Your savings ratio looks healthy.'
            );
        }

        // NO EXPENSES
        if (expense === 0) {

            insights.push(
                '💡 Start tracking your expenses regularly.'
            );
        }

        // HIGH INCOME
        if (
    income >= 50000 &&
    balance > income * 0.3
) {

    insights.push(
        '📈 Consider investing part of your income.'
    );
}
        // NEGATIVE BALANCE
        if (balance < 0) {

            insights.push(
                '🚨 Your expenses exceed your income.'
            );
        }

        // LOW SAVINGS
        if (income > 0 && balance < income * 0.1) {

            insights.push(
                '⚠️ Your monthly savings are very low.'
            );
        }

        // FALLBACK
        if (insights.length === 0) {

            insights.push(
                '✅ Your finances look stable right now.'
            );
        }

        res.status(200).json({
            success: true,
            insights
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: 'Failed to generate insights'
        });
    }
};

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction,
    getInsights
}