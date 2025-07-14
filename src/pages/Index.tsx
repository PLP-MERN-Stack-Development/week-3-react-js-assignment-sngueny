import { TaskManager } from '@/components/TaskManager';
import { ApiDemo } from '@/components/ApiDemo';

const Index = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          TaskMaster Pro
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A modern task management application built with React, TypeScript, and Tailwind CSS. 
          Manage your tasks efficiently with a beautiful, responsive interface.
        </p>
      </div>

      {/* Task Manager Section */}
      <div className="mb-12">
        <TaskManager />
      </div>

      {/* API Demo Section */}
      <div>
        <ApiDemo />
      </div>
    </div>
  );
};

export default Index;
