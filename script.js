// Initialize users array in localStorage if it doesn't exist
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }

        // Initialize todos array in localStorage if it doesn't exist
        if (!localStorage.getItem('todos')) {
            localStorage.setItem('todos', JSON.stringify([]));
        }

        // Show the specified page and hide others
        function showPage(pageId) {
            document.getElementById('homePage').classList.add('hidden');
            document.getElementById('signupPage').classList.add('hidden');
            document.getElementById('signinPage').classList.add('hidden');
            document.getElementById('dashboard').classList.add('hidden');
            
            document.getElementById(pageId).classList.remove('hidden');
        }

        // Show dashboard section
        function showDashboardSection(section) {
            // Hide all sections
            document.getElementById('taskboard-section').classList.add('hidden');
            document.getElementById('todo-section').classList.add('hidden');
            document.getElementById('payment-section').classList.add('hidden');
            document.getElementById('staff-section').classList.add('hidden');
            
            // Remove active class from all menu items
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Show selected section and set active menu item
            document.getElementById(`${section}-section`).classList.remove('hidden');
            document.querySelector(`.menu-item[onclick="showDashboardSection('${section}')"]`).classList.add('active');
            
            // Update dashboard title
            const titles = {
                'taskboard': 'Task Board',
                'todo': 'Todo List',
                'payment': 'Payments',
                'staff': 'Staff'
            };
            document.getElementById('dashboard-title').textContent = titles[section];
        }

        // Check authentication status
        function checkAuthStatus() {
            const currentUser = getCurrentUser();
            
            if (currentUser) {
                // Show dashboard
                document.getElementById('dashboard').classList.remove('hidden');
                // Hide auth container
                document.getElementById('authContainer').classList.add('hidden');
                
                // Update user info
                document.getElementById('userNameDisplay').textContent = currentUser.name;
                document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
                
                // Load todos
                loadTodos();
                return true;
            }
            return false;
        }

        // Get current user from localStorage
        function getCurrentUser() {
            return JSON.parse(localStorage.getItem('currentUser'));
        }

        // Sign Up Form Handling
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const messageDiv = document.getElementById('signupMessage');
            
            // Validate passwords match
            if (password !== confirmPassword) {
                messageDiv.textContent = 'Passwords do not match!';
                messageDiv.className = 'message error';
                return;
            }
            
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Check if user already exists
            if (users.some(user => user.email === email)) {
                messageDiv.textContent = 'User with this email already exists!';
                messageDiv.className = 'message error';
                return;
            }
            
            // Add new user
            users.push({
                name,
                email,
                password // Note: In a real app, you should NEVER store plain text passwords
            });
            
            localStorage.setItem('users', JSON.stringify(users));
            
            messageDiv.textContent = 'Sign up successful! Please sign in.';
            messageDiv.className = 'message success';
            
            // Clear form
            document.getElementById('signupForm').reset();
            
            // Show sign in page after delay
            setTimeout(() => {
                showPage('signinPage');
            }, 1500);
        });

        // Sign In Form Handling
        document.getElementById('signinForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;
            
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(user => user.email === email && user.password === password);
            
            const messageDiv = document.getElementById('signinMessage');
            
            if (user) {
                // Store current user in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                messageDiv.textContent = 'Sign in successful! Redirecting...';
                messageDiv.className = 'message success';
                
                // Clear form
                document.getElementById('signinForm').reset();
                
                // Show dashboard after delay
                setTimeout(() => {
                    checkAuthStatus();
                }, 1000);
            } else {
                messageDiv.textContent = 'Invalid email or password!';
                messageDiv.className = 'message error';
            }
        });

        // Todo List Functions
        function loadTodos() {
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            const todoList = document.getElementById('todoList');
            todoList.innerHTML = '';
            
            todos.forEach((todo, index) => {
                const todoItem = document.createElement('div');
                todoItem.className = `todo-item ${todo.completed ? 'todo-completed' : ''}`;
                todoItem.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                        onchange="toggleTodo(${index})">
                    <div class="todo-text">${todo.text}</div>
                    <div class="todo-actions">
                        <button onclick="deleteTodo(${index})">Delete</button>
                    </div>
                `;
                todoList.appendChild(todoItem);
            });
        }

        function addTodo() {
            const input = document.getElementById('newTodoInput');
            const text = input.value.trim();
            
            if (text) {
                const todos = JSON.parse(localStorage.getItem('todos')) || [];
                todos.push({ text, completed: false });
                localStorage.setItem('todos', JSON.stringify(todos));
                input.value = '';
                loadTodos();
            }
        }

        function toggleTodo(index) {
            const todos = JSON.parse(localStorage.getItem('todos'));
            todos[index].completed = !todos[index].completed;
            localStorage.setItem('todos', JSON.stringify(todos));
            loadTodos();
        }

        function deleteTodo(index) {
            const todos = JSON.parse(localStorage.getItem('todos'));
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            loadTodos();
        }

        // Logout function
        function logout() {
            localStorage.removeItem('currentUser');
            document.getElementById('dashboard').classList.add('hidden');
            document.getElementById('authContainer').classList.remove('hidden');
            showPage('homePage');
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            // Show home page by default
            showPage('homePage');
            checkAuthStatus();
        });