import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FormList = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      const result = await axios.get('/api/forms');
      setForms(result.data);
    };
    fetchForms();
  }, []);

  return (
    <div>
      <h1>All Forms</h1>
      <ul>
        {forms.map((form) => (
          <li key={form._id}>
            <Link to={`/forms/${form._id}`}>{form.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormList;
