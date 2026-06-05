const getHealth = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} detik`,
  });
};

module.exports = { getHealth };
