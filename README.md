# 🛒 SwiftCart E-Commerce Website

A fully functional and responsive e-commerce website built with vanilla HTML, CSS (Tailwind CSS + DaisyUI), and JavaScript. This project fetches real product data from the Fake Store API and provides a complete shopping experience.

---

## 📚 JavaScript Questions & Answers

### Question 1: What is the difference between null and undefined?

**Undefined Explanation:**  
When a variable is declared but no value is assigned to it, JavaScript automatically marks it as `undefined`.

**Null Explanation:**  
This is a deliberate or intentional assignment. When a developer wants to indicate that a variable currently holds no value or is intentionally empty, they directly assign the value `null`.

---

### Question 2: What is the use of the map() function in JavaScript? How is it different from forEach()?

**Map() Functionality:**  
map() is an array method that performs a specific operation on each element of the array and returns a completely new array. It does not modify the original array.

**Key Differences from forEach():**
* **map()** always returns a new array, which is ideal for data transformation and modification.
* **forEach()** only loops through the array and returns nothing. It is used for creating side-effects.

---

### Question 3: What is the difference between == and ===?

* **== (Loose Equality):** This only checks the equality of two values, but does not check the data type. It performs type conversion if needed.
* **=== (Strict Equality):** This checks both the value and the data type. No type conversion occurs.

---

### Question 4: What is the significance of async/await in fetching API data?

Data from servers or APIs takes some time to arrive, which is an asynchronous process.

* **Benefits of Async/Await:** It forces JavaScript code to wait for data to arrive, making the code much easier to read and write in a sequential manner.
* **Error Handling:** Error management is easily done using `try/catch` blocks.
* **Code Clarity:** Instead of Promise chaining, much more readable and maintainable code can be written.

---

### Question 5: Explain the concept of Scope in JavaScript (Global, Function, Block).

Scope determines from which parts of the code a variable can be accessed.

* **Global Scope:** Variables declared outside functions are accessible from the entire codebase.
* **Function Scope:** Variables declared inside a function are only usable within that function and cannot be accessed from outside.
* **Block Scope:** Variables declared with `let` and `const` inside curly braces `{ }` are limited only within that block.

---

## 🌐 API Endpoints Used

- **All Products:** `https://fakestoreapi.com/products`
- **All Categories:** `https://fakestoreapi.com/products/categories`
- **Products by Category:** `https://fakestoreapi.com/products/category/{category}`
- **Single Product:** `https://fakestoreapi.com/products/{id}`

---

## 📄 License

All Rights Reserved to Ammar Bin Anwar Fuad.

---

## 👨‍💻 Author

**Ammar Bin Anwar Fuad**

---
