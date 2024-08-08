import Form from './Form';
import Info from './Info';

const LoginPage = () => (
  <div className="flex min-h-screen bg-gray-100">
    <div className="flex flex-1 overflow-hidden bg-white shadow-md">
      <div className="flex-1 p-6 border-r border-gray-200 flex flex-col">
        <Info />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-center">
        <Form />
      </div>
    </div>
  </div>
);

export default LoginPage;
