import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import React, {useState} from "react";
import axios from "axios";
import {Doughnut} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
        const { ctx, chartArea: { top, bottom, left, right } } = chart;
        const text = chart.options.plugins.centerText;
        if (text) {
            ctx.save();
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#555";
            ctx.fillText(text, (left + right) / 2, (top + bottom) / 2);
            ctx.restore();
        }
    }
};

ChartJS.register(centerTextPlugin);

const DonutChart = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
    const [isIncomeMode, setIsIncomeMode] = useState(true);
    const [transactions, setTransactions] = useState({
        expenses: {},
        incomes: {},
    });
    const [newTransaction, setNewTransaction] = useState({
        type: 'INCOME',
        category: '',
        description: '',
        amount: '',
        date: '',
    });
    const [editTransaction, setEditTransaction] = useState(null);

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const categories = [
        { name: "ENTERTAINMENT", color: "#4fc3f7" },
        { name: "Категория 2", color: "#ff4081" },
        { name: "Категория 3", color: "#4caf50" },
        { name: "Категория 4", color: "#cfd8dc" },
        { name: "Категория 5", color: "#ffcc80" },
        { name: "Категория 6", color: "#90caf9" },
        { name: "Категория 7", color: "#ff8a65" },
        { name: "Категория 8", color: "#a5a6a7" },
        { name: "Категория 9", color: "#e0e0e0" },
        { name: "Категория 10", color: "#b39ddb" },
    ];

    const handlePrevMonth = () => {
        setMonthIndex((prev) => (prev - 1 + months.length) % months.length);
    };

    const handleNextMonth = () => {
        setMonthIndex((prev) => (prev + 1) % months.length);
    };

    const handleAddTransaction = async () => {
        if (!newTransaction.category || !newTransaction.description || !newTransaction.amount || !newTransaction.date) {
            alert('Все поля должны быть заполнены!');
            return;
        }

        const [year, month] = newTransaction.date.split('-');
        const monthKey = `${year}-${months[parseInt(month) - 1]}`;
        setTransactions((prev) => {
            const updatedTransactions = { ...prev };
            const typeKey = newTransaction.type === 'INCOME' ? 'INCOMES' : 'EXPENSES';
            if (!updatedTransactions[typeKey][monthKey]) {
                updatedTransactions[typeKey][monthKey] = [];
            }
            updatedTransactions[typeKey][monthKey].push({
                category: newTransaction.category,
                description: newTransaction.description,
                amount: parseFloat(newTransaction.amount),
                date: newTransaction.date,
            });

            return updatedTransactions;
        });

        setNewTransaction({ type: 'INCOME', category: '', description: '', amount: '', date: '' });
        axios.post('http://localhost:8080/api/transactions', data, {
            headers: {
                'Content-Type': 'application/json',  // Указываем тип данных
            },
            withCredentials: true  // Включаем передачу куки
        })
            .then(response => {
                console.log('Success:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };


    const handleEditTransaction = (transaction) => {
        console.log('Редактируем транзакцию:', transaction); // Добавить лог для отладки
        setEditTransaction(transaction);
    };

    const handleSaveEditTransaction = () => {
        if (!editTransaction.category || !editTransaction.description || !editTransaction.amount || !editTransaction.date) {
            alert('Все поля должны быть заполнены!');
            return;
        }

        const [year, month] = editTransaction.date.split('-');
        const monthKey = `${year}-${months[parseInt(month) - 1]}`;

        setTransactions((prev) => {
            const updatedTransactions = { ...prev };
            const typeKey = editTransaction.type === 'income' ? 'incomes' : 'expenses';
            const transactionsForMonth = updatedTransactions[typeKey][monthKey] || [];

            const updatedTransactionsForMonth = transactionsForMonth.map((t) =>
                t.date === editTransaction.date ? { ...editTransaction } : t
            );

            updatedTransactions[typeKey][monthKey] = updatedTransactionsForMonth;
            return updatedTransactions;
        });

        setEditTransaction(null);
    };





    const handleDeleteTransaction = (transaction) => {
        const [year, month] = transaction.date.split('-');
        const monthKey = `${year}-${months[parseInt(month) - 1]}`;

        setTransactions((prev) => {
            const updatedTransactions = { ...prev };
            const typeKey = transaction.type === 'INCOME' ? 'INCOMES' : 'EXPENSES';

            // Проверка на наличие транзакций
            const filteredTransactions = updatedTransactions[typeKey][monthKey] || [];

            updatedTransactions[typeKey][monthKey] = filteredTransactions.filter(
                (t) => t.date !== transaction.date || t.description !== transaction.description || t.amount !== transaction.amount
            );

            return updatedTransactions;
        });
    };



    const currentMonth = months[monthIndex];
    const currentMonthKey = `${year}-${currentMonth}`;

    const currentTransactions = isIncomeMode
        ? transactions.incomes[currentMonthKey] || []
        : transactions.expenses[currentMonthKey] || [];



    // Добавляем защиту от ошибок для категорий
    const data = {
        labels: categories.map((cat) => cat.name),
        datasets: [
            {
                data: categories.map((cat) => {
                    // Защита от undefined
                    return (currentTransactions || [])
                        .filter((t) => t.category === cat.name)
                        .reduce((sum, t) => sum + t.amount, 0);
                }),
                backgroundColor: categories.map((cat) => cat.color),
                hoverBackgroundColor: categories.map((cat) => cat.color),
            },
        ],
    };


    const options = {
        responsive: true,
        cutout: "70%",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
            centerText: `${currentMonth} ${year}`,
        },
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            {/* Выбор года */}
            <div>
                <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    style={{
                        marginBottom: "10px",
                        padding: "5px",
                        fontSize: "16px",
                    }}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            {/* Динамическая диаграмма */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button
                    onClick={handlePrevMonth}
                    style={{
                        marginRight: "20px",
                        padding: "10px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    ←
                </button>

                <div style={{ width: "400px", height: "400px" }}>
                    <Doughnut data={data} options={options} />
                </div>

                <button
                    onClick={handleNextMonth}
                    style={{
                        marginLeft: "20px",
                        padding: "10px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    →
                </button>
            </div>

            {/* Переключение между доходами и расходами */}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => setIsIncomeMode(!isIncomeMode)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        backgroundColor: isIncomeMode ? "#4caf50" : "#f44336",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                    }}
                >
                    {isIncomeMode ? "Показать расходы" : "Показать доходы"}
                </button>
            </div>

            {/* Форма добавления новой транзакции */}
            <div style={{ marginTop: "20px" }}>
                <h3>Добавить транзакцию</h3>
                <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                >
                    <option value="income">Доход</option>
                    <option value="expense">Расход</option>
                </select>

                <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Описание"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                />

                <input
                    type="number"
                    placeholder="Сумма"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                />

                <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                />

                <button
                    onClick={handleAddTransaction}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                    }}
                >
                    Добавить
                </button>
            </div>

            {/* Список транзакций */}
            <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "400px", margin: "20px auto" }}>
                <h3>Список транзакций</h3>
                <ul>
                    {currentTransactions.map((t, index) => (
                        <li key={index} style={{ marginBottom: "10px" }}>
                            <strong>{t.category}</strong> - {t.description} - {t.date} - {t.amount} ₽
                            <button onClick={() => handleEditTransaction(t)} style={{ marginLeft: "10px", cursor: "pointer" }}>
                                Редактировать
                            </button>
                            <button
                                onClick={() => handleDeleteTransaction(t)}
                                style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    padding: "5px",
                                }}
                            >
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Форма редактирования транзакции */}
            {editTransaction && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Редактировать транзакцию</h3>
                    <select
                        value={editTransaction.type}
                        onChange={(e) => setEditTransaction({ ...editTransaction, type: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    >
                        <option value="income">Доход</option>
                        <option value="expense">Расход</option>
                    </select>

                    <select
                        value={editTransaction.category}
                        onChange={(e) => setEditTransaction({ ...editTransaction, category: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Описание"
                        value={editTransaction.description}
                        onChange={(e) => setEditTransaction({ ...editTransaction, description: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    />

                    <input
                        type="text"
                        placeholder="Сумма"
                        value={editTransaction.amount}
                        onChange={(e) => setEditTransaction({ ...editTransaction, amount: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    />

                    <input
                        type="date"
                        value={editTransaction.date}
                        onChange={(e) => setEditTransaction({ ...editTransaction, date: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    />

                    <button
                        onClick={handleSaveEditTransaction}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            backgroundColor: "#4caf50",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                        }}
                    >
                        Сохранить
                    </button>
                </div>
            )}
        </div>
    );
};

export default DonutChart;