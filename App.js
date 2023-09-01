import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import phonebookService from './phonebookService';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    phonebookService
      .getAll()
      .then(data => {
        setPersons(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const addPerson = event => {
    event.preventDefault();

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmMessage = `${newName} is already in the phonebook. Replace the old number with a new one?`;

      if (window.confirm(confirmMessage)) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        phonebookService
          .update(existingPerson.id, updatedPerson)
          .then(data => {
            setPersons(
              persons.map(person =>
                person.id === data.id ? data : person
              )
            );
            setNewName('');
            setNewNumber('');
            toast.success('Number updated successfully', { autoClose: 2000 });
          })
          .catch(error => {
            console.error('Error updating person:', error);
            toast.error('Error updating number');
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      phonebookService
        .create(newPerson)
        .then(data => {
          setPersons([...persons, data]);
          setNewName('');
          setNewNumber('');
          toast.success('Person added successfully', { autoClose: 2000 });
        })
        .catch(error => {
          console.error('Error adding a new person:', error);
          toast.error('Error adding person');
        });
    }
  };

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = event => {
    setSearchName(event.target.value);
  };

  const deletePerson = id => {
    const personToDelete = persons.find(person => person.id === id);
    const confirmMessage = `Delete ${personToDelete.name}?`;

    if (window.confirm(confirmMessage)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          toast.success('Person deleted successfully', { autoClose: 2000 });
        })
        .catch(error => {
          console.error('Error deleting a person:', error);
          toast.error('Error deleting person');
        });
    }
  };

  const filteredPersons = searchName
    ? persons.filter(person =>
        person.name.toLowerCase().includes(searchName.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        Search: <input value={searchName} onChange={handleSearchChange} />
      </div>

      <h3>Add a new contact</h3>

      <form onSubmit={addPerson}>
        <div>
          Name: <input value={newName} onChange={handleNameChange} />
        </div>
        <br />
        <div>
          Number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>

      <h3>Contacts</h3>

      <ul>
        {filteredPersons.map(person => (
          <li key={person.id}>
            {person.name} - {person.number}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <ToastContainer />
    </div>
  );
};

export default App;



