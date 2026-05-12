 import React, { useState } from 'react';

function ExpenseForm({ addTransaction }) {
    const [formData, setFormData] = useState({
        text: '',
        amount: '',
        type: 'expense'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.text || !formData.amount) {
            alert('Please fill all fields');
            return;
        }

        addTransaction({
            text: formData.text,
            amount: Number(formData.amount),
            type: formData.type
        });

        setFormData({
            text: '',
            amount: '',
            type: 'expense'
        });
    };

    return (
        <div className="form-card">
            <h2>Expense Tracker</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="Enter description"
                />

                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                />

                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                <button type="submit">Add Transaction</button>
            </form>
        </div>
    );
}

export default ExpenseForm;