import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Select from 'react-select';
import "./rol.css";

const Rol = () => {
    const [nombre_rol, setNombreRol] = useState('');
    const [rol, setRol] = useState([]);
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingRol, setEditingRol] = useState(null);
    const [editNombreRol, setEditNombreRol] = useState('');
    const [editSelectedMenu, setEditSelectedMenu] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        handleGetUsers();
        handleGetMenus();
    }, []);

    const handleChange = (selectedOption) => {
        setSelectedMenu(selectedOption);
    };

    const roleOptions = menus?.map((menu) => ({
        value: menu.id,
        label: menu.nombre_menu
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedOptionIds = selectedMenu?.map((option) => option.value);

        if (!nombre_rol) {
            swal({
                title: "Error al Agregar Cargo!",
                text: "Por favor, completa todos los campos requeridos",
                icon: "error",
                button: "Ok",
            });
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await axios.post("http://localhost:8000/api/rol", {
                nombre_rol,
                menus: selectedOptionIds,
                estado: 1,
            });

            setNombreRol('');
            setSelectedMenu([]);
            swal({ title: "Cargo agregado!", icon: "success", button: "Ok" });
            handleGetUsers();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGetUsers = async () => {
        const res = await axios.get("http://localhost:8000/api/rol");
        setRol(res.data.data.rol);
    };

    const handleGetMenus = async () => {
        const res = await axios.get("http://localhost:8000/api/menu");
        setMenus(res.data.data.menu);
    };

    const handleDarBaja = async (cargo) => {
        await axios.put(`http://localhost:8000/api/rol/baja/${cargo.id}`, { estado: 0 });
        swal({ title: `Cargo ${cargo.nombre_rol} dado de baja`, icon: "success", button: "Ok" });
        handleGetUsers();
    };

    const handleDarReintegrar = async (cargo) => {
        await axios.put(`http://localhost:8000/api/rol/baja/${cargo.id}`, { estado: 1 });
        swal({ title: `Cargo ${cargo.nombre_rol} reintegrado`, icon: "success", button: "Ok" });
        handleGetUsers();
    };

    const handleDarEliminar = async (cargo) => {
        await axios.put(`http://localhost:8000/api/rol/baja/${cargo.id}`, { estado: 3 });
        swal({ title: `Cargo ${cargo.nombre_rol} eliminado`, icon: "success", button: "Ok" });
        handleGetUsers();
    };

    const handleEditClick = (rol) => {
        setEditingRol(rol);
        setEditNombreRol(rol.nombre_rol);
        setEditSelectedMenu(
            rol.menu_rols.map((menuRol) => ({
                value: menuRol.menu.id,
                label: menuRol.menu.nombre_menu,
            }))
        );
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const selectedOptionIds = editSelectedMenu.map((option) => option.value);

        if (!editNombreRol) {
            swal({
                title: "Error al Editar Cargo!",
                text: "Por favor, completa todos los campos requeridos",
                icon: "error",
                button: "Ok",
            });
            return;
        }

        await axios.put(`http://localhost:8000/api/rol/${editingRol.id}`, {
            nombre_rol: editNombreRol,
            menus: selectedOptionIds,
            estado: editingRol.estado,
        });

        swal({ title: "Cargo editado!", icon: "success", button: "Ok" });
        handleGetUsers();
        setEditingRol(null);
        setEditNombreRol('');
        setEditSelectedMenu([]);
    };

    const filteredCargos = rol?.filter((r) =>
        r?.nombre_rol?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="rol container mt-4">
            <h1 className="text-center fw-bold mb-4">📋 Gestión de Cargos</h1>

            <ul className="nav nav-tabs" id="rolTabs" role="tablist">
                <li className="nav-item">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#agregar">
                        ➕ Agregar Cargo
                    </button>
                </li>
                <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#lista">
                        📋 Lista
                    </button>
                </li>
                <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#bajas">
                        🗑️ Bajas
                    </button>
                </li>
            </ul>

            <div className="tab-content mt-3">
                {/* TAB AGREGAR */}

                <div className="tab-pane fade show active" id="agregar">
                    <div className="card shadow-sm p-4 mb-4">
                        <form onSubmit={handleSubmit} >
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre del Cargo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nombre_rol}
                                        onChange={(e) => setNombreRol(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Accesos</label>
                                    <Select
                                        value={selectedMenu}
                                        onChange={handleChange}
                                        options={roleOptions}
                                        placeholder="Seleccione..."
                                        isMulti
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                {isSubmitting ? "Guardando..." : "Guardar Cargo"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* TAB LISTA */}
                <div className="tab-pane fade" id="lista">
                    <div className="card shadow-sm p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                            <input
                                type="text"
                                placeholder="🔍 Buscar cargo..."
                                className="form-control w-25"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table table-hover table-striped align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Cargo</th>
                                        <th>Accesos</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCargos
                                        ?.filter((r) => r.estado === 1)
                                        .map((rol, index) => (
                                            <tr key={rol.id}>
                                                <td>{index + 1}</td>
                                                <td>{rol.nombre_rol}</td>
                                                <td>
                                                    {rol.menu_rols.length > 0
                                                        ? rol.menu_rols.map((m) => m.menu.nombre_menu).join(", ")
                                                        : "Sin accesos"}
                                                </td>
                                                <td>
                                                    <span className="badge bg-success">Activo</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-primary me-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#modalEdit"
                                                        onClick={() => handleEditClick(rol)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i> Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDarBaja(rol)}
                                                    >
                                                        <i className="bi bi-person-dash"></i> Baja
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* TAB BAJAS */}
                <div className="tab-pane fade" id="bajas">
                    <div className="card shadow-sm p-4 mb-4">
                        <div className="table-responsive mt-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table table-hover table-striped align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Cargo</th>
                                        <th>Accesos</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rol
                                        ?.filter((r) => r.estado === 0)
                                        .map((rol, index) => (
                                            <tr key={rol.id}>
                                                <td>{index + 1}</td>
                                                <td>{rol.nombre_rol}</td>
                                                <td>
                                                    {rol.menu_rols.length > 0
                                                        ? rol.menu_rols.map((m) => m.menu.nombre_menu).join(", ")
                                                        : "Sin accesos"}
                                                </td>
                                                <td>
                                                    <span className="badge bg-secondary">Inactivo</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success me-2"
                                                        onClick={() => handleDarReintegrar(rol)}
                                                    >
                                                        <i className="bi bi-arrow-clockwise"></i> Reintegrar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDarEliminar(rol)}
                                                    >
                                                        <i className="bi bi-trash"></i> Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL EDITAR */}
            <div className="modal fade" id="modalEdit" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">Editar Cargo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre Cargo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editNombreRol}
                                        onChange={(e) => setEditNombreRol(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Accesos</label>
                                    <Select
                                        value={editSelectedMenu}
                                        onChange={setEditSelectedMenu}
                                        options={roleOptions}
                                        isMulti
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Cerrar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rol;
