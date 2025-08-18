import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { 
  Users, 
  Clock, 
  Play, 
  Square,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';

const Employees: React.FC = () => {
  const { users, shifts, startShift, endShift } = useData();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  const activeShifts = shifts.filter(s => !s.endTime);
  const todayShifts = shifts.filter(s => 
    format(s.startTime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const handleStartShift = async () => {
    if (!selectedEmployee) return;
    await startShift(selectedEmployee);
    setSelectedEmployee('');
  };

  const handleEndShift = async (shiftId: string) => {
    await endShift(shiftId);
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const hours = differenceInHours(end, startTime);
    const minutes = differenceInMinutes(end, startTime) % 60;
    return `${hours}h ${minutes}m`;
  };

  const getEmployeeStats = (employeeId: string) => {
    const employeeShifts = shifts.filter(s => s.employeeId === employeeId);
    const completedShifts = employeeShifts.filter(s => s.endTime);
    const totalHours = completedShifts.reduce((sum, shift) => 
      sum + differenceInHours(shift.endTime!, shift.startTime), 0
    );
    const totalSales = employeeShifts.reduce((sum, shift) => 
      sum + (shift.totalSales || 0), 0
    );
    
    return { totalShifts: employeeShifts.length, totalHours, totalSales };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees & Shifts</h1>
          <p className="text-gray-600">Manage employee schedules and performance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-gray-600">Total Employees</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Play className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{activeShifts.length}</p>
              <p className="text-gray-600">Active Shifts</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{todayShifts.length}</p>
              <p className="text-gray-600">Today's Shifts</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">
                {Math.round(shifts.reduce((sum, shift) => {
                  const end = shift.endTime || new Date();
                  return sum + differenceInHours(end, shift.startTime);
                }, 0) / shifts.length) || 0}
              </p>
              <p className="text-gray-600">Avg Hours/Shift</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Start New Shift */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <Play className="w-5 h-5 mr-2 text-green-600" />
              Start New Shift
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employee
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose employee...</option>
                  {users
                    .filter(user => !activeShifts.some(shift => shift.employeeId === user.id))
                    .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.role}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleStartShift}
                disabled={!selectedEmployee}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Shift
              </button>
            </div>
          </div>
        </div>

        {/* Active Shifts */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Active Shifts ({activeShifts.length})
            </h2>
          </div>
          <div className="p-6">
            {activeShifts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active shifts</p>
            ) : (
              <div className="space-y-4">
                {activeShifts.map(shift => (
                  <div key={shift.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{shift.employee.name}</p>
                        <p className="text-sm text-gray-600">
                          Started: {format(shift.startTime, 'HH:mm')}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          Duration: {formatDuration(shift.startTime)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEndShift(shift.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center"
                    >
                      <Square className="w-3 h-3 mr-1" />
                      End Shift
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employee Performance */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Employee Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Shifts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => {
                const stats = getEmployeeStats(user.id);
                const isActive = activeShifts.some(s => s.employeeId === user.id);
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'Owner' 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'Manager'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.totalShifts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.totalHours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      Rs. {stats.totalSales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isActive ? 'Active' : 'Off'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Shifts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Shifts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shifts.slice(0, 10).map(shift => (
                <tr key={shift.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {shift.employee.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(shift.startTime, 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(shift.startTime, 'HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shift.endTime ? format(shift.endTime, 'HH:mm') : (
                      <span className="text-green-600 font-medium">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(shift.startTime, shift.endTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    Rs. {(shift.totalSales || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;