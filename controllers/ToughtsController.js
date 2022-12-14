const Tought = require('../models/Tought');
const User = require('../models/User');

const { Op } = require('sequelize');

module.exports = class ToughtsController {
  static async showToughts(req, res) {
    let search = '';

    if (req.query.search) {
      search = req.query.search;
    }

    // Metodo de ordernar
    let order = 'DESC';

    if (req.query.order === 'old') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        // metodo de Search
        title: { [Op.like]: `%${search}%` },
      },
      // ordernar
      order: [['createdAt', order]],
    });

    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    let toughtsQty = toughts.length;

    if (toughtsQty === 0) {
      toughtsQty = false;
    }

    res.render('toughts/home', { toughts, search, toughtsQty });
  }

  // buscar conteudo do BD
  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Tought,
      plain: true,
    });

    // check if user exists
    if (!user) {
      res.redirect('/login');
    }

    // pega o conteudo e filtar com map em uma Array
    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false;

    // verificar a quantidade de elementos no arr
    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render('toughts/dashboard', { toughts, emptyToughts });
  }

  static createTought(req, res) {
    res.render('toughts/create');
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);

      req.flash('message', 'Pensamento criado com sucesso!');
      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log('Aconteceu um erro:' + error);
    }
  }

  // Remover Conteudo
  static async removeTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });

      req.flash('message', 'Pensamento removido com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log('Aconteceu um erro:' + error);
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ where: { id: id }, raw: true });

    res.render('toughts/edit', { tought });
  }

  // Editar Conteudo
  static async updateToughtSave(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
    };

    await Tought.update(tought, { where: { id: id } });

    req.flash('message', 'Pensamento atualizado com sucesso!');

    req.session.save(() => {
      res.redirect('/toughts/dashboard');
    });
  }
  catch(error) {
    console.log('Aconteceu um erro:' + error);
  }
};
