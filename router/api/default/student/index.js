import { Router } from 'express';
import { serviceMiddleware } from '../../../../middleware/service';
import students from './students.json';

const router = Router();

router.use('/', serviceMiddleware);

router.get('/class/:grade/:klass', (req, res, _) => {
  const { grade, klass } = req.params;

  return res.json(students.filter(student => 
    student.grade === grade &&
    student.klass === klass
  ).map(student => 
    (({ name, serial, grade, klass, user_id, username }) => 
      ({ name, serial, grade, klass, username, idx: user_id }))(student)
  ));
});

export default router;
