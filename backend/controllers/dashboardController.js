// Contoh di dalam Controller Backend kamu
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await getLatestPrediction(userId);

    if (!data) {
      return res.status(200).json({
        status: "success",
        data: { usage: 0, bill: 0, efficiency: 0, carbonImpact: 0 }
      });
    }

    const usage = Number(data.prediction) || 0;
    const bill = Math.round(usage * 1444);

   
    
    
    const carbonImpact = Math.round(usage * 0.85);
    let efficiency = 100 - Math.round((usage / 300) * 100);
    if (efficiency < 0) efficiency = 5; 
    if (efficiency > 100) efficiency = 100;

    res.json({
      status: "success",
      data: {
        predictedUsage: usage,
        predictedBill: bill,
        month: data.month,
        efficiency: efficiency, 
        carbonImpact: carbonImpact
      },
    });

  } catch (error) {
    next(error);
  }
};