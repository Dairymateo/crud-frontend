import React, { useState, useEffect } from 'react';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const apiUrl = 'http://localhost:3000/employees';
  // *** ASUMIENDO QUE LA API DEVUELVE '_id' COMO IDENTIFICADOR ***
  const idPropertyName = '_id'; // <--- AJUSTA ESTO SI TU API USA OTRO NOMBRE

  useEffect(() => {
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error al obtener empleados: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setEmployees(data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const handleAddEmployee = async (newEmployee) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees([...employees, data]);
        setShowAddForm(false);
      } else {
        console.error('Error al crear empleado:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee);
    setShowAddForm(true);
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      // Construye la URL usando 'id' como espera tu backend
      const response = await fetch(`${apiUrl}/${updatedEmployee[idPropertyName]}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmployee),
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(employees.map(emp => emp[idPropertyName] === data[idPropertyName] ? data : emp));
        setEmployeeToEdit(null);
        setShowAddForm(false);
      } else {
        console.error('Error al actualizar empleado:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteEmployee = async (idToDelete) => {
    console.log('ID a eliminar (empleado):', idToDelete);
    try {
      const response = await fetch(`${apiUrl}/${idToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        setEmployees(employees.filter(emp => emp[idPropertyName] !== idToDelete));
      } else {
        console.error('Error al eliminar empleado:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Employees</h2>
      <p>A list of all the employees.</p>
      <button onClick={() => setShowAddForm(true)}>Add Employee</button>

      {showAddForm && <AddEmployeeForm onEmployeeAdded={handleAddEmployee} employeeToEdit={employeeToEdit} onEmployeeUpdated={handleUpdateEmployee} idPropertyName={idPropertyName} />}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee[idPropertyName]}>
              <td>{employee[idPropertyName]}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>
                <button onClick={() => handleEditEmployee(employee)}>Edit</button>
                <button onClick={() => handleDeleteEmployee(employee[idPropertyName])}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddEmployeeForm({ onEmployeeAdded, employeeToEdit, onEmployeeUpdated, idPropertyName }) {
  const [name, setName] = useState(employeeToEdit?.name || '');
  const [email, setEmail] = useState(employeeToEdit?.email || '');
  const [phone, setPhone] = useState(employeeToEdit?.phone || '');
  const [salary, setSalary] = useState(employeeToEdit?.salary || '');
  const [department, setDepartment] = useState(employeeToEdit?.department || '');
  const [id, setId] = useState(employeeToEdit?.[idPropertyName] || null);

  useEffect(() => {
    if (employeeToEdit?.[idPropertyName]) {
      setId(employeeToEdit[idPropertyName]);
    } else {
      setId(null);
    }
    setName(employeeToEdit?.name || '');
    setEmail(employeeToEdit?.email || '');
    setPhone(employeeToEdit?.phone || '');
    setSalary(employeeToEdit?.salary || '');
    setDepartment(employeeToEdit?.department || '');
  }, [employeeToEdit, idPropertyName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const employeeData = { name, email, phone, salary: parseFloat(salary), department };
    if (id) {
      onEmployeeUpdated({ [idPropertyName]: id, ...employeeData });
    } else {
      onEmployeeAdded(employeeData);
    }
    setName('');
    setEmail('');
    setPhone('');
    setSalary('');
    setDepartment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
      <input placeholder="Salary" value={salary} onChange={e => setSalary(e.target.value)} type="number" />
      <input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
      <button type="submit">{id ? 'Update Employee' : 'Add Employee'}</button>
    </form>
  );
}

export default EmployeeList;