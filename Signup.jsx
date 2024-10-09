import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setLoading } from '../../redux/authSlice';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaImage } from 'react-icons/fa';
import { USER_API_END_POINT } from '../../utils/constant';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    file: ''
  });
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('password', input.password);
    formData.append('role', input.role);
    if (input.file) {
      formData.append('file', input.file);
    }

    try {
      dispatch(setLoading(true)); 
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate('/login');
        toast.success(res.data.message);
      }
      console.log(input);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-blue-300 to-indigo-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 space-y-6 transform transition-all hover:shadow-2xl hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Create Your Account</h2>

        <form className="space-y-6" onSubmit={submitHandler}>
          {['fullname', 'email', 'phoneNumber', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                {field === 'fullname' && <FaUser className="mr-2 text-indigo-600" />}
                {field === 'email' && <FaEnvelope className="mr-2 text-indigo-600" />}
                {field === 'phoneNumber' && <FaPhone className="mr-2 text-indigo-600" />}
                {field === 'password' && <FaLock className="mr-2 text-indigo-600" />}
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={input[field]}
                onChange={changeEventHandler}
                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-400 focus:outline-none focus:ring-opacity-50 shadow-sm transition duration-300 ease-in-out"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="flex items-center space-x-6">
              {['student', 'admin'].map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    id={role}
                    checked={input.role === role}
                    onChange={changeEventHandler}
                    className="focus:ring focus:ring-indigo-400 focus:outline-none focus:ring-opacity-50 cursor-pointer w-4 h-4 transition-transform transform duration-200 ease-in-out"
                  />
                  <label htmlFor={role} className="ml-2 text-sm text-gray-700">{role.charAt(0).toUpperCase() + role.slice(1)}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaImage className="mr-2 text-indigo-600" /> Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
              className="mt-2 cursor-pointer border border-gray-300 rounded-lg p-2 focus:ring focus:ring-indigo-400 focus:outline-none transition duration-300 ease-in-out"
            />
            {input.file && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(input.file)}
                  alt="Profile Preview"
                  className="w-20 h-20 object-cover rounded-full shadow-lg transition transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 mt-4 font-semibold rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition duration-300 ease-in-out`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:underline">Login here</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
