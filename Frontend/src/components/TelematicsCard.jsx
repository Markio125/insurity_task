function TelematicsCard({ telematicsData }) {
    // Debug: Log the telematics data to console
    console.log('TelematicsCard received data:', telematicsData)

    const {
        'Insured.age': age,
        'Insured.sex': sex,
        'Car.age': carAge,
        Marital: marital,
        'Car.use': carUse,
        Region: region,
        'Annual.miles.drive': annualMiles,
        'Years.noclaims': yearsNoClaims,
        'Avgdays.week': avgDaysWeek,
        'NB_Claim': nbClaim,
        'AMT_Claim': amtClaim,
        'Accel.06miles': accel06,
        'Accel.14miles': accel14,
        'Brake.06miles': brake06,
        'Brake.08miles': brake08,
        'Brake.14miles': brake14
    } = telematicsData


    // Calculate risk score based on driving behavior
    const calculateRiskScore = () => {
        let riskScore = 50 // Base score

        // Age factor
        if (age < 25) riskScore += 15
        else if (age > 65) riskScore += 10
        else if (age >= 30 && age <= 50) riskScore -= 10

        // Experience factor
        if (yearsNoClaims > 10) riskScore -= 15
        else if (yearsNoClaims < 2) riskScore += 10

        // Driving behavior
        const totalAccel = accel06 + accel14
        const totalBrake = brake06 + brake08 + brake14
        if (totalAccel > 100) riskScore += 10
        if (totalBrake > 200) riskScore += 15

        // Claims history
        if (nbClaim > 0) riskScore += 20

        return Math.max(0, Math.min(100, riskScore))
    }

    const riskScore = calculateRiskScore()
    const getRiskLevel = (score) => {
        if (score <= 30) return { level: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-100' }
        if (score <= 60) return { level: 'Medium Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
        return { level: 'High Risk', color: 'text-red-600', bgColor: 'bg-red-100' }
    }

    const riskLevel = getRiskLevel(riskScore)

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Telematics Data</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${riskLevel.color} ${riskLevel.bgColor}`}>
                    {riskLevel.level}
                </div>
            </div>

            {/* Personal Information */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium text-gray-500">{age} years</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium text-gray-500">{sex}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Marital Status:</span>
                        <span className="font-medium text-gray-500">{marital}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Region:</span>
                        <span className="font-medium text-gray-500">{region}</span>
                    </div>
                </div>
            </div>

            {/* Vehicle Information */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Car Age:</span>
                        <span className="font-medium text-gray-500">{carAge >= 0 ? `${carAge} years` : 'New'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Usage:</span>
                        <span className="font-medium text-gray-500">{carUse}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Annual Miles:</span>
                        <span className="font-medium text-gray-500">{Math.round(annualMiles).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Years No Claims:</span>
                        <span className="font-medium text-gray-500">{yearsNoClaims}</span>
                    </div>
                </div>
            </div>

            {/* Driving Behavior */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Driving Behavior</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg Days Driving/Week:</span>
                        <span className="font-medium">{avgDaysWeek.toFixed(1)} days</span>
                    </div>

                    {/* Acceleration Events */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">Hard Acceleration Events:</span>
                            <span className="font-medium">{accel06 + accel14}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>0.6+ mph/s:</span>
                                <span>{accel06}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>1.4+ mph/s:</span>
                                <span>{accel14}</span>
                            </div>
                        </div>
                    </div>

                    {/* Braking Events */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">Hard Braking Events:</span>
                            <span className="font-medium">{brake06 + brake08 + brake14}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>0.6+ mph/s:</span>
                                <span>{brake06}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>0.8+ mph/s:</span>
                                <span>{brake08}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>1.4+ mph/s:</span>
                                <span>{brake14}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Claims Information */}
            <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Claims History</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{nbClaim}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Number of Claims</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">${amtClaim.toFixed(0)}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total Claim Amount</p>
                    </div>
                </div>
            </div>

            {/* Risk Score */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Calculated Risk Score:</span>
                    <span className={`font-bold text-lg ${riskLevel.color}`}>{riskScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${riskScore <= 30 ? 'bg-green-500' :
                            riskScore <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${riskScore}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default TelematicsCard
