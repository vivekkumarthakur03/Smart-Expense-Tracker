 import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import dashboardBg from '../assets/dashboard.jpg';

import './Home.css';

import ExpenseTable from './ExpenseTable';
import ExpenseForm from './ExpenseForm';

const API = 'http://127.0.0.1:5000';

const handleSuccess = (msg) => toast.success(msg);
const handleError = (msg) => toast.error(msg);

function Home() {

    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);

    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);

    // ✅ AI INSIGHTS
    const [insights, setInsights] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    // ✅ LOGOUT
    const handleLogout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');

        handleSuccess('User Logged out');

        navigate('/login');
    };

    // ✅ CALCULATE TOTALS
    useEffect(() => {

        const income = expenses
            .filter(item => item.type === 'income')
            .reduce((acc, item) => acc + item.amount, 0);

        const exp = expenses
            .filter(item => item.type === 'expense')
            .reduce((acc, item) => acc + item.amount, 0);

        setIncomeAmt(income);
        setExpenseAmt(exp);

    }, [expenses]);

    // ✅ FETCH EXPENSES
    const fetchExpenses = async () => {

        try {

            const response = await fetch(`${API}/expenses`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (response.status === 403) {

                localStorage.removeItem('token');
                localStorage.removeItem('loggedInUser');

                navigate('/login');

                return;
            }

            const result = await response.json();

            setExpenses(result.data);

        } catch (err) {

            handleError('Failed to fetch expenses');
        }
    };

    // ✅ FETCH AI INSIGHTS
    const fetchInsights = async () => {

        try {

            const response = await fetch(
                `${API}/expenses/insights`,
                {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            const result = await response.json();

            if (result.success) {
                setInsights(result.insights);
            }

        } catch (err) {

            console.log(err);

            toast.error('Failed to load AI insights');
        }
    };

    // ✅ ADD TRANSACTION
    const addTransaction = async (data) => {

        try {

            const response = await fetch(`${API}/expenses`, {

                method: 'POST',

                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)
            });

            if (response.status === 403) {

                localStorage.removeItem('token');
                localStorage.removeItem('loggedInUser');

                navigate('/login');

                return;
            }

            const result = await response.json();

            handleSuccess(result.message);

            setExpenses(result.data);

            // ✅ REFRESH AI
            fetchInsights();

        } catch (err) {

            handleError('Failed to add transaction');
        }
    };

    // ✅ DELETE TRANSACTION
    const deleteExpens = async (id) => {

        try {

            const response = await fetch(
                `${API}/expenses/${id}`,
                {
                    method: 'DELETE',

                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            if (response.status === 403) {

                localStorage.removeItem('token');
                localStorage.removeItem('loggedInUser');

                navigate('/login');

                return;
            }

            const result = await response.json();

            handleSuccess(result.message);

            setExpenses(result.data);

            // ✅ REFRESH AI
            fetchInsights();

        } catch (err) {

            handleError('Failed to delete transaction');
        }
    };

    // ✅ INITIAL LOAD
    useEffect(() => {

        fetchExpenses();

        fetchInsights();

    }, []);

    return (

        <div
            className="dashboard"
            style={{
                backgroundImage: `url(${dashboardBg})`
            }}
        >

            {/* HEADER */}
            <div className="header">

                <h2>
                    Welcome, {loggedInUser}
                </h2>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            {/* SUMMARY */}
            <div className="summary">

                <div className="card income">
                    <h4>Income</h4>
                    <p>₹{incomeAmt}</p>
                </div>

                <div className="card expense">
                    <h4>Expense</h4>
                    <p>₹{expenseAmt}</p>
                </div>

                <div className="card balance">
                    <h4>Balance</h4>
                    <p>₹{incomeAmt - expenseAmt}</p>
                </div>

            </div>

            {/* AI INSIGHTS */}

            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto 30px auto',
                    background: 'rgba(255,255,255,0.78)',
                    backdropFilter: 'blur(10px)',
                    padding: '25px',
                    borderRadius: '18px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    position: 'relative',
                    zIndex: 1
                }}
            >

                <h2
                    style={{
                        marginBottom: '20px',
                        color: '#111827'
                    }}
                >
                    🧠 AI Financial Insights
                </h2>

                {
                    insights.map((item, index) => (

                        <p
                            key={index}
                            style={{
                                marginBottom: '12px',
                                fontSize: '17px',
                                color: '#374151'
                            }}
                        >
                            {item}
                        </p>
                    ))
                }

            </div>

            {/* MAIN */}
            <div className="main">

                {/* FORM */}
                <div className="form-section">

                    <ExpenseForm
                        addTransaction={addTransaction}
                    />

                </div>

                {/* TABLE */}
                <div className="table-section">

                    <ExpenseTable
                        expenses={expenses}
                        deleteExpens={deleteExpens}
                    />

                </div>

            </div>

            <ToastContainer />

        </div>
    );
}

export default Home;