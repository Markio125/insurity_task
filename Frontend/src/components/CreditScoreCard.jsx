function CreditScoreCard({ userData }) {
    const { user_id, credit_score, premium } = userData

    // Function to determine credit score status and color
    const getCreditScoreStatus = (score) => {
        if (score >= 750) return { status: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
        if (score >= 700) return { status: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' }
        if (score >= 650) return { status: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' }
        if (score >= 600) return { status: 'Poor', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
        return { status: 'Very Poor', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
    }

    const scoreStatus = getCreditScoreStatus(credit_score)

    // Calculate credit score percentage for progress bar
    const scorePercentage = Math.min(((credit_score - 50) / 850) * 100, 100)

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Credit Score</h2>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">User #{user_id}</span>
                </div>
            </div>

            {/* Credit Score Display */}
            <div className="text-center mb-6">
                <div className="relative inline-block">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                        {Math.round(credit_score - 50)}
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${scoreStatus.color} ${scoreStatus.bgColor} ${scoreStatus.borderColor} border`}>
                        {scoreStatus.status}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>300</span>
                    <span>850</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${scorePercentage}%` }}
                    ></div>
                    <div
                        className="relative -mt-3 ml-2 w-3 h-3 bg-gray-800 rounded-full border-2 border-white shadow-md transition-all duration-500 ease-out"
                        style={{ left: `${scorePercentage}%`, transform: 'translateX(-50%)' }}
                    ></div>
                </div>
            </div>

            {/* Premium Information */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Insurance Premium</p>
                        <p className="text-xs text-gray-500">Annual premium amount</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                            ${premium.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">per year</p>
                    </div>
                </div>
            </div>

            {/* Score Breakdown */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Range</p>
                    <p className="text-sm font-semibold text-gray-900">300-850</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Your Score</p>
                    <p className="text-sm font-semibold text-gray-900">{Math.round(credit_score)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                    <p className={`text-sm font-semibold ${scoreStatus.color}`}>{scoreStatus.status}</p>
                </div>
            </div>
        </div>
    )
}

export default CreditScoreCard
