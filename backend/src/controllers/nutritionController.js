const Nutrition = require('../models/Nutrition');

// Yeni beslenme kaydı oluştur
exports.createNutrition = async (req, res) => {
  try {
    const nutrition = new Nutrition({
      ...req.body,
      userId: req.user._id
    });
    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Kullanıcının beslenme kayıtlarını getir
exports.getNutritions = async (req, res) => {
  try {
    const nutritions = await Nutrition.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(nutritions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir beslenme kaydını getir
exports.getNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!nutrition) {
      return res.status(404).json({ message: 'Beslenme kaydı bulunamadı' });
    }
    res.json(nutrition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Beslenme kaydını güncelle
exports.updateNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!nutrition) {
      return res.status(404).json({ message: 'Beslenme kaydı bulunamadı' });
    }
    res.json(nutrition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Beslenme kaydını sil
exports.deleteNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!nutrition) {
      return res.status(404).json({ message: 'Beslenme kaydı bulunamadı' });
    }
    res.json({ message: 'Beslenme kaydı silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 