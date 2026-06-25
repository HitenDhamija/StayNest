import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [redirect, setRedirect] = useState(false);
  const auth = useAuth();

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const response = await auth.register(formData);
    if (response.success) {
      toast.success(response.message);
      setRedirect(true);
    } else {
      toast.error(response.message);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="pt-24 flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-lg shadow-vercel-lg p-8 mb-24">
        <h1 className="text-2xl font-semibold tracking-[-1.0px] text-neutral-900 font-sans text-center mb-6">
          Create an Account
        </h1>
        
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
              Your Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleFormData}
              className="mt-0"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleFormData}
              className="mt-0"
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleFormData}
              className="mt-0"
            />
          </div>

          <button className="primary mt-6">Register</button>
        </form>

        <div className="text-center text-xs text-neutral-500 font-sans border-t border-border pt-4 mt-6">
          Already a member?{' '}
          <Link className="text-neutral-900 font-medium hover:underline ml-1" to={'/login'}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
