
document.addEventListener('DOMContentLoaded', () => {

    let addBtn = document.getElementById('addExpenseBtn');

    addBtn.addEventListener('click', (event) => {

        event.preventDefault();

        let title = document.getElementById('title').value.trim();
        let amount = document.getElementById('amount').value;
        let category = document.getElementById('category').value;
        let date = document.getElementById('date').value;

        let hasErrors = false;

        let fields = ['title', 'amount', 'category', 'date'];

        fields.forEach((field) => {
            document.getElementById(field).classList.remove('is-invalid');
            document.querySelector('.error[data-for="' + field + '"]').textContent = '';
        });

        if (title === '') {
            document.getElementById('title').classList.add('is-invalid');
            document.querySelector('.error[data-for="title"]').textContent = 'Please enter a title.';
            hasErrors = true;
        }

        if (amount === '' || Number(amount) <= 0) {
            document.getElementById('amount').classList.add('is-invalid');
            document.querySelector('.error[data-for="amount"]').textContent = 'Enter an amount greater than 0.';
            hasErrors = true;
        }

        if (category === '') {
            document.getElementById('category').classList.add('is-invalid');
            document.querySelector('.error[data-for="category"]').textContent = 'Please select a category.';
            hasErrors = true;
        }

        if (date === '') {
            document.getElementById('date').classList.add('is-invalid');
            document.querySelector('.error[data-for="date"]').textContent = 'Please select a date.';
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        let newExpense = {
            id: Date.now(),
            title: title,
            amount: Number(amount),
            category: category,
            date: date
        };

        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

        if (!Array.isArray(expenses)) {
            expenses = [];
        }

        expenses.push(newExpense);

        localStorage.setItem('expenses', JSON.stringify(expenses));

        let recentList = document.getElementById('recent-list');
        let item = document.createElement('li');

        item.className = 'list-group-item';
        item.textContent = date + ' - ' + title + ' - ' + amount + ' Lek';

        recentList.prepend(item);

        document.getElementById('recent').classList.remove('d-none');

        document.getElementById('expense-form').reset();

        let toast = document.getElementById('toast');
        toast.textContent = 'Expense added successfully!';
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);

    });

});
