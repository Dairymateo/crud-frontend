import React, { useState, useEffect } from 'react';
import './TaskList.css'; // Importa el archivo CSS

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const apiUrl = 'http://localhost:3000/task';
  const employeesApiUrl = 'http://localhost:3000/employees';
  const projectsApiUrl = 'http://localhost:3000/proyects';
  const idPropertyName = '_id';

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error(`Error al obtener tareas: ${res.status}`);
      }
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(employeesApiUrl);
      if (!res.ok) {
        throw new Error(`Error al obtener empleados: ${res.status}`);
      }
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(projectsApiUrl);
      if (!res.ok) {
        throw new Error(`Error al obtener proyectos: ${res.status}`);
      }
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        await fetchTasks();
        setShowAddForm(false);
      } else {
        const errorData = await response.json();
        console.error('Error al crear tarea:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setShowAddForm(true);
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await fetch(`${apiUrl}/${updatedTask[idPropertyName]}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (response.ok) {
        await fetchTasks();
        setTaskToEdit(null);
        setShowAddForm(false);
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar tarea:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteTask = async (idToDelete) => {
    try {
      const response = await fetch(`${apiUrl}/${idToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchTasks();
      } else {
        console.error('Error al eliminar tarea:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="task-list-container">
      <h2 className="task-list-heading">Lista de Tareas</h2>
      <button className="add-task-button" onClick={() => setShowAddForm(true)}>
        Agregar Tarea
      </button>

      {showAddForm && (
        <AddTaskForm
          onTaskAdded={handleAddTask}
          taskToEdit={taskToEdit}
          onTaskUpdated={handleUpdateTask}
          idPropertyName={idPropertyName}
          employees={employees}
          projects={projects}
        />
      )}

      <table className="task-table">
        <thead className="task-table-head">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Empleado</th>
            <th>Proyecto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="task-table-body">
          {tasks.map(task => (
            <tr key={task[idPropertyName]} className="task-row">
              <td>{task[idPropertyName]}</td>
              <td>{task.name}</td>
              <td>{task.description}</td>
              <td className="task-status">{task.status}</td>
              <td>
                {employees.find(emp => emp[idPropertyName] === task.employeeId)?.name || 'N/A'}
              </td>
              <td>
                {projects.find(proj => proj[idPropertyName] === task.proyectId)?.name || 'N/A'}
              </td>
              <td>{new Date(task.date).toLocaleDateString()}</td>
              <td className="task-actions">
                <button className="edit-button" onClick={() => handleEditTask(task)}>
                  Editar
                </button>
                <button className="delete-button" onClick={() => handleDeleteTask(task[idPropertyName])}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddTaskForm({ onTaskAdded, taskToEdit, onTaskUpdated, idPropertyName, employees, projects }) {
  const [name, setName] = useState(taskToEdit?.name || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [status, setStatus] = useState(taskToEdit?.status || 'Pendiente');
  const [employeeId, setEmployeeId] = useState(taskToEdit?.employeeId || '');
  const [proyectId, setProyectId] = useState(taskToEdit?.proyectId || '');
  const [dateStr, setDateStr] = useState(taskToEdit?.date ? new Date(taskToEdit.date).toISOString().slice(0, 10) : '');
  const [id, setId] = useState(taskToEdit?.[idPropertyName] || null);

  const statusOptions = ['Pendiente', 'En Progreso', 'Completada', 'Cancelada'];

  useEffect(() => {
    if (taskToEdit?.[idPropertyName]) {
      setId(taskToEdit[idPropertyName]);
    } else {
      setId(null);
    }
    setName(taskToEdit?.name || '');
    setDescription(taskToEdit?.description || '');
    setStatus(taskToEdit?.status || 'Pendiente');
    setEmployeeId(taskToEdit?.employeeId || '');
    setProyectId(taskToEdit?.proyectId || '');
    setDateStr(taskToEdit?.date ? new Date(taskToEdit.date).toISOString().slice(0, 10) : '');
  }, [taskToEdit, idPropertyName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      name,
      description,
      status,
      employeeId,
      proyectId,
      date: dateStr, // Enviamos la cadena directamente en formato AAAA-MM-DD
    };
    if (id) {
      onTaskUpdated({ [idPropertyName]: id, ...taskData });
    } else {
      onTaskAdded(taskData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="task-description-input"
      />
      <select value={status} onChange={e => setStatus(e.target.value)} className="task-status-select">
        {statusOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        value={employeeId}
        onChange={e => setEmployeeId(e.target.value)}
        required
        className="employee-select"
      >
        <option value="">Seleccionar Empleado</option>
        {employees.map(employee => (
          <option key={employee[idPropertyName]} value={employee[idPropertyName]}>
            {employee.name}
          </option>
        ))}
      </select>
      <select
        value={proyectId}
        onChange={e => setProyectId(e.target.value)}
        required
        className="project-select"
      >
        <option value="">Seleccionar Proyecto</option>
        {projects.map(project => (
          <option key={project[idPropertyName]} value={project[idPropertyName]}>
            {project.name}
          </option>
        ))}
      </select>
      <div className="date-input-group">
        <label htmlFor="date">Fecha:</label>
        <input
          type="date"
          id="date"
          value={dateStr}
          onChange={e => setDateStr(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-button">
        {id ? 'Actualizar Tarea' : 'Agregar Tarea'}
      </button>
    </form>
  );
}

export default TaskList;