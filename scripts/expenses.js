
document.addEventListener('DOMContentLoaded', () => {

    let expenseTable = document.getElementById('expense-list');
    let searchBox = document.getElementById('search');
    let categoryFilter = document.getElementById('filter-category');
    let editModal = new bootstrap.Modal(document.getElementById('edit-modal'));

    let expenses = [];

    function loadExpenses() {
        let savedData = localStorage.getItem('expenses');

        try {
            expenses = savedData ? JSON.parse(savedData) : [];
        } catch (error) {
            expenses = [];
        }

        if (!Array.isArray(expenses)) {
            expenses = [];
        }

        let changed = false;

        expenses.forEach((expense, index) => {
            if (!expense.id) {
                expense.id = Date.now() + index;
                changed = true;
            }
        });

        if (changed) {
            saveExpenses();
        }
    }

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function showMessage(message) {
        let toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function updateStatistics() {
        let total = 0;
        let biggest = null;

        expenses.forEach((expense) => {
            total += Number(expense.amount);

            if (biggest === null ||
                Number(expense.amount) > Number(biggest.amount)) {
                biggest = expense;
            }
        });

        document.getElementById('stat-total').textContent = total + ' Lek';
        document.getElementById('stat-count').textContent = expenses.length;

        let average = expenses.length > 0
            ? Math.round(total / expenses.length)
            : 0;

        document.getElementById('stat-average').textContent = average + ' Lek';

        document.getElementById('stat-biggest').textContent =
            biggest ? biggest.title + ' (' + biggest.amount + ' Lek)' : 'None';
    }

    function displayExpenses() {
        loadExpenses();
        updateStatistics();

        expenseTable.innerHTML = '';

        let searchText = searchBox.value.toLowerCase();
        let selectedCategory = categoryFilter.value;
        let visibleCount = 0;

        expenses.forEach((expense) => {

            let matchesTitle = expense.title.toLowerCase().includes(searchText);
            let matchesCategory =
                selectedCategory === '' || expense.category === selectedCategory;

            if (matchesTitle && matchesCategory) {

                let row = document.createElement('tr');

                let dateCell = document.createElement('td');
                dateCell.textContent = expense.date;

                let titleCell = document.createElement('td');
                titleCell.textContent = expense.title;

                let categoryCell = document.createElement('td');
                categoryCell.textContent = expense.category;

                let amountCell = document.createElement('td');
                amountCell.className = 'text-end';
                amountCell.textContent = expense.amount + ' Lek';

                let actionsCell = document.createElement('td');
                actionsCell.className = 'text-end';

                let editButton = document.createElement('button');
                editButton.className = 'btn btn-sm btn-outline-primary me-2';
                editButton.textContent = 'Edit';

                editButton.addEventListener('click', () => {
                    document.getElementById('edit-id').value = expense.id;
                    document.getElementById('edit-title').value = expense.title;
                    document.getElementById('edit-amount').value = expense.amount;
                    document.getElementById('edit-category').value = expense.category;
                    document.getElementById('edit-date').value = expense.date;

                    editModal.show();
                });

                let deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-sm btn-outline-danger';
                deleteButton.textContent = 'Delete';

                deleteButton.addEventListener('click', () => {
                    if (confirm('Delete this expense?')) {
                        expenses = expenses.filter(
                            item => String(item.id) !== String(expense.id)
                        );

                        saveExpenses();
                        displayExpenses();
                        showMessage('Expense deleted');
                    }
                });

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                row.appendChild(dateCell);
                row.appendChild(titleCell);
                row.appendChild(categoryCell);
                row.appendChild(amountCell);
                row.appendChild(actionsCell);

                expenseTable.appendChild(row);
                visibleCount++;
            }
        });

        document.getElementById('count').textContent = visibleCount;

        document.getElementById('empty-message').classList.toggle(
            'd-none', visibleCount > 0
        );
    }

    document.getElementById('edit-form').addEventListener('submit', (event) => {
        event.preventDefault();

        let expenseId = document.getElementById('edit-id').value;
        let title = document.getElementById('edit-title').value.trim();
        let amount = document.getElementById('edit-amount').value;
        let category = document.getElementById('edit-category').value;
        let date = document.getElementById('edit-date').value;

        let fields = ['title', 'amount', 'category', 'date'];
        let hasErrors = false;

        fields.forEach((field) => {
            let input = document.getElementById('edit-' + field);
            let error = document.querySelector('.error[data-for="' + field + '"]');

            input.classList.remove('is-invalid');
            error.textContent = '';
        });

        function showError(field, message) {
            document.getElementById('edit-' + field).classList.add('is-invalid');
            document.querySelector('.error[data-for="' + field + '"]').textContent = message;
            hasErrors = true;
        }

        if (title === '') {
            showError('title', 'Title is required.');
        }

        if (amount === '' || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            showError('amount', 'Enter an amount greater than zero.');
        }

        if (category === '') {
            showError('category', 'Please select a category.');
        }

        if (date === '') {
            showError('date', 'Date is required.');
        }

        if (hasErrors) {
            return;
        }

        let expense = expenses.find(
            item => String(item.id) === String(expenseId)
        );

        if (!expense) {
            showMessage('Expense not found');
            return;
        }

        expense.title = title;
        expense.amount = Number(amount);
        expense.category = category;
        expense.date = date;

        saveExpenses();
        editModal.hide();
        displayExpenses();
        showMessage('Expense updated successfully');
    });

    searchBox.addEventListener('input', displayExpenses);
    categoryFilter.addEventListener('change', displayExpenses);

    document.getElementById('clear-all').addEventListener('click', () => {
        if (confirm('Delete all expenses?')) {
            expenses = [];
            saveExpenses();
            displayExpenses();
            showMessage('All expenses deleted');
        }
    });

    document.getElementById('load-sample').addEventListener('click', () => {
        expenses = [
            { id: Date.now(), title: 'Coffee', amount: 350, category: 'Food', date: '2026-11-02' },
            { id: Date.now() + 1, title: 'Bus ticket', amount: 40, category: 'Transport', date: '2026-11-03' },
            { id: Date.now() + 2, title: 'Textbook', amount: 2500, category: 'Books', date: '2026-11-05' },
            { id: Date.now() + 3, title: 'Cinema', amount: 600, category: 'Fun', date: '2026-11-07' }
        ];

        saveExpenses();
        displayExpenses();
        showMessage('Sample expenses loaded');
    });

    displayExpenses();

});
