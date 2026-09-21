import  {useState} from 'react';
import Siderbar from './Sidebar';
import Header from './Header';

const AppLayout = ({children}) => {
     const [isSiderbarOpen , setIsSiderbarOpen] = useState(false);

     const toggleSidebar = () => {
        setIsSiderbarOpen(!isSiderbarOpen);
     }

  return (
   <div className="flex h-screen bg-neutral-50 text-neutral-900">
    <Siderbar isSiderbarOpen={isSiderbarOpen} toggleSidebar={toggleSidebar} />
    <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            {children}
        </main>
    </div>
   </div>
  );
}
   
export default AppLayout