import { useState, useEffect } from 'react'
import UserSearch from './UserSearch'
import CreditScoreCard from './CreditScoreCard'
import TelematicsCard from './TelematicsCard'
import StatsOverview from './StatsOverview'
import { API_CONFIG, apiClient } from '../utils/api'

function Dashboard() {
	const [userData, setUserData] = useState(null)
	const [telematicsData, setTelematicsData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [apiStatus, setApiStatus] = useState('checking')

	// Check API status on component mount
	useEffect(() => {
		checkApiStatus()
	}, [])

	const checkApiStatus = async () => {
		try {
			await apiClient.get(API_CONFIG.ENDPOINTS.HEALTH_CHECK)
			setApiStatus('connected')
		} catch (error) {
			console.error('API connection error:', error)
			setApiStatus('error')
		}
	}

	const fetchUserData = async (userId) => {
		if (!userId || userId < 10001) {
			setError('Please enter a valid user ID (10001 or higher)')
			return
		}

		setLoading(true)
		setError(null)
		setUserData(null)
		setTelematicsData(null)

		try {
			// Fetch credit score data and telematics data in parallel
			console.log('Fetching data for user:', userId)
			const [creditData, telematicsDataResponse] = await Promise.all([
				apiClient.get(`${API_CONFIG.ENDPOINTS.USER_CREDIT_INFO}/${userId}`),
				apiClient.get(`${API_CONFIG.ENDPOINTS.USER_TELEMATICS_INFO}/${userId}`)
			])

			console.log('Credit data received:', creditData)
			console.log('Telematics data received:', telematicsDataResponse)

			if (creditData.error || telematicsDataResponse.error) {
				setError(creditData.error || telematicsDataResponse.error)
			} else if (creditData.message || telematicsDataResponse.message) {
				setError('User not found')
			} else {
				setUserData(creditData)
				setTelematicsData(telematicsDataResponse)
				console.log('State updated - userData:', creditData)
				console.log('State updated - telematicsData:', telematicsDataResponse)
			}
		} catch (error) {
			console.error('Error fetching user data:', error)
			setError('Failed to fetch user data. Please check if the API server is running.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Insurity Credit Score Dashboard
							</h1>
							<p className="text-gray-600 mt-1">
								Monitor credit scores and telematics data
							</p>
						</div>
						<div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${apiStatus === 'connected'
							? 'bg-green-100 text-green-800'
							: apiStatus === 'error'
								? 'bg-red-100 text-red-800'
								: 'bg-yellow-100 text-yellow-800'
							}`}>
							<div className={`w-2 h-2 rounded-full ${apiStatus === 'connected'
								? 'bg-green-500'
								: apiStatus === 'error'
									? 'bg-red-500'
									: 'bg-yellow-500'
								}`}></div>
							<span>
								{apiStatus === 'connected' ? 'API Connected' :
									apiStatus === 'error' ? 'API Disconnected' : 'Checking API...'}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Search Section */}
				<div className="mb-8">
					<UserSearch onSearch={fetchUserData} loading={loading} />
				</div>

				{/* Error Display */}
				{error && (
					<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-red-800">Error</h3>
								<div className="mt-2 text-sm text-red-700">
									<p>{error}</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Dashboard Content */}
				{userData && telematicsData && (
					<div className="space-y-6">
						{/* Stats Overview */}
						<StatsOverview userData={userData} telematicsData={telematicsData} />

						{/* Main Cards */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<CreditScoreCard userData={userData} />
							<TelematicsCard telematicsData={telematicsData} />
						</div>
					</div>
				)}

				{/* Empty State */}
				{!loading && !userData && !error && (
					<div className="text-center py-12">
						<div className="mx-auto h-24 w-24 text-gray-400">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
						<h3 className="mt-4 text-lg font-medium text-gray-900">No data to display</h3>
						<p className="mt-2 text-gray-500">Search for a user ID to view their credit score and telematics data.</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Dashboard
