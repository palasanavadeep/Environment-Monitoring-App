import React from 'react';

const UserProfile = () => {
  const tasks = [
    { title: 'Plant a Tree', width: '80%' },
    { title: 'Host an Event - save Rivers', width: '70%' },
    { title: 'Complete the  Daily Quiz', width: '90%' },
    { title: 'Conduct a event on Water Pollution', width: '80%' },
    { title: 'Make a community with 100 Users', width: '40%' },
  ];

  const teamMembers = [
    'Haritha Haram', 'Save Musi', 'Save water', 'Rain Updates', 'Summer sims', 'Free plants'
  ];

  return (
    <div className="py-20 flex justify-center items-center min-h-screen">
      <div className="p-6 max-w-4xl bg-white rounded-xl shadow-md grid grid-cols-3 gap-6">
        <div className="col-span-1 flex flex-col items-center">
          <img src="images.jpeg" alt="Profile" className="w-32 h-32 rounded-full" />
          <h1 className="text-2xl font-bold mt-4">Sunny Soumith Uppala</h1>
          <p className="text-gray-500">Level 1</p>
          <div className="mt-4 flex items-center">
            <span className="text-blue-500 text-2xl flex items-center">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                <circle cx='12' cy='12' r='10' stroke='blue' strokeWidth='2' fill='white' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4' />
              </svg>
              <span className="ml-2 text-sm font-semibold text-blue-600">Verified</span>
            </span>
          </div>
          <ul className="mt-4 text-left space-y-1 w-full">
            <li className="text-gray-400 flex justify-between">
              <span>No. of Missions - </span>
              <span className="noofmissions">19</span>
            </li>
            <li className="text-gray-400 flex justify-between">
              <span>Coins -</span>
              <span className="coins">129</span>
            </li>
            <li className="text-gray-400 flex justify-between">
              <span>Points - </span>
              <span className="points">1909</span>
            </li>
          </ul>
        </div>

        <div className="col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold"><strong>Current missions</strong></h2>
            <ul className="mt-4 space-y-2">
              {tasks.map((task) => (
                <li key={task.title} className="grid grid-cols-2 items-center gap-4">
                  <span className="text-sm text-gray-700">{task.title}</span>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: task.width }}></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Communities You Joined..</h2>
            <div className="flex space-x-4 mt-4">
              {teamMembers.map((member) => (
                <div key={member} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <p className="text-sm mt-2">{member}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
