import React, { useState, useEffect } from 'react';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const apiUrl = 'http://localhost:3000/proyects';

  useEffect(() => {
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error al obtener proyectos: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const handleAddProject = async (newProject) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      if (response.ok) {
        const data = await response.json();
        setProjects([...projects, data]);
        setShowAddForm(false);
      } else {
        console.error('Error al crear proyecto:', response.status);
      }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setShowAddForm(true);
  };

  const handleUpdateProject = async (updatedProject) => {
    try {
      const response = await fetch(`${apiUrl}/${updatedProject._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(projects.map(proj => proj._id === data._id ? data : proj));
        setProjectToEdit(null);
        setShowAddForm(false);
      } else {
        console.error('Error al actualizar proyecto:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteProject = async (idToDelete) => {
    console.log('ID a eliminar:', idToDelete);
    try {
      const response = await fetch(`${apiUrl}/${idToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        setProjects(projects.filter(proj => proj._id !== idToDelete));
      } else {
        console.error('Error al eliminar proyecto:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Projects</h2>
      <p>A list of all the projects in your database including their ID and name.</p>
      <button onClick={() => setShowAddForm(true)}>Add project</button>

      {showAddForm && <AddProjectForm onProjectAdded={handleAddProject} projectToEdit={projectToEdit} onProjectUpdated={handleUpdateProject} />}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project._id}>
              <td>{project._id}</td>
              <td>{project.name}</td>
              <td>
                <button onClick={() => handleEditProject(project)}>Edit</button>
                <button onClick={() => handleDeleteProject(project._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddProjectForm({ onProjectAdded, projectToEdit, onProjectUpdated }) {
  const [name, setName] = useState(projectToEdit?.name || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [status, setStatus] = useState(projectToEdit?.status || '');
  const [budget, setBudget] = useState(projectToEdit?.budget || 0);
  const [_id, setId] = useState(projectToEdit?._id || null);

  useEffect(() => {
    if (projectToEdit?._id) {
      setId(projectToEdit._id);
    } else {
      setId(null);
    }
    setName(projectToEdit?.name || '');
    setDescription(projectToEdit?.description || '');
    setStatus(projectToEdit?.status || '');
    setBudget(projectToEdit?.budget || 0);
  }, [projectToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = { name, description, status, budget };
    if (_id) {
      onProjectUpdated({ _id, ...projectData });
    } else {
      onProjectAdded(projectData);
    }
    setName('');
    setDescription('');
    setStatus('');
    setBudget(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="Status" value={status} onChange={e => setStatus(e.target.value)} />
      <input type="number" placeholder="Budget" value={budget} onChange={e => setBudget(parseInt(e.target.value))} />
      <button type="submit">{_id ? 'Update Project' : 'Add Project'}</button>
    </form>
  );
}

export default ProjectList;