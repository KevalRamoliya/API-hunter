import React, { useEffect, useState } from 'react'
// import Post from './Post';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { getApi } from './Constant';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'



const Call = () => {
    const [edit, setedit] = useState(false);
    const [data, setdata] = useState([]);
    const [update, setupdate] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const handle = (e) => {
        axios.post(getApi, e)
            .then((res) => {
                console.log(res.data);
                setdata([...data, res.data]);
                reset();
            })
            .catch((error) => {
                console.error("Error submitting data:", error);
            });
    }

    const fetch = () => {
        axios.get(getApi).then((res) => {
            setdata(res.data)
        })
    }

    useEffect(() => {
        fetch();
    }, [])

    const removedata = (index, id) => {
        const alldata = [...data];
        const filter = alldata.filter((_, id) => id !== index);
        setdata(filter);

        axios.delete(`${getApi}/${id}`).then((res) => {
            console.log("Data deleted from the server:", res.data);
        }).catch((error) => {
            console.error("Error deleting data from the server:", error);
        });
    }



    const editdata = (index) => {
        console.log(index);
        const a = data[index];
        console.log(a, "aa");
        setupdate(a)
        setedit(true)
    }

    const handleInputChange = (e) => {
        setupdate({ ...update, [e.target.name]: e.target.value });
    }

    const change = () => {
        const updatedItem = { ...update, ...update.id };

        axios.put(`${getApi}/${update.id}`, updatedItem)
            .then((res) => {
                reset();
                console.log('Data updated:', res.data);
                fetch();
                setedit(false)
            })
            .catch((error) => {
                console.error('Error updating data:', error);
            });
    }

    return (
        <div>
            {/* <Post /> */}
            <form onSubmit={handleSubmit((e) => handle(e, reset))}>

                <input {...register('firstName')} value={update.firstName} onChange={handleInputChange} />
                <input {...register('lastName', { required: true })} value={update.lastName} onChange={handleInputChange} />
                {errors.lastName && <p>Last name is required.</p>}
                <input {...register('age', { pattern: /\d+/ })} value={update.age} onChange={handleInputChange} />
                {errors.age && <p>Please enter number for age.</p>}
                <input type="submit" disabled={edit} />
            </form>
            <button onClick={change} disabled={!edit} a>Update</button>
            <DragDropContext onDragEnd={handle}>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Age</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <Droppable droppableId='tbody'>
                        {
                            (provider) => (
                                <tbody ref={provider.innerRef} {...provider.droppableProps}>
                                    {
                                        data?.map((item, index) => (
                                            <Draggable draggableId={item.id} index={index}>
                                                {
                                                    (provider) => (
                                                        <tr key={index} ref={provider.innerRef}
                                                            {...provider.draggableProps}
                                                            {...provider.dragHandleProps}>
                                                            <td>{item.id}</td>
                                                            <td>{item.firstName}</td>
                                                            <td>{item.lastName}</td>
                                                            <td>{item.age}</td>
                                                            <td>
                                                                <button onClick={() => removedata(index,item.id)}>Delete</button>
                                                            </td>
                                                            <td><button onClick={() => editdata(index)}>Edit</button></td>
                                                        </tr>
                                                    )
                                                }
                                            </Draggable>
                                        ))
                                    }
                                </tbody>
                            )
                        }
                    </Droppable>
                </table>
            </DragDropContext>

        </div>
    )
}

export default Call
