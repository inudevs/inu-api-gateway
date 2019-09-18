import { Router } from 'express';
import { serviceMiddleware } from '../../../../middleware/service';
import students from './students.json';

const router = Router();

// router.use('/', serviceMiddleware);

router.get('/class/:grade/:klass', (req, res, _) => {
  const grade = parseInt(req.params.grade);
  const klass = parseInt(req.params.klass);

  return res.json(students.filter(student => 
    student.grade === grade &&
    student.class === klass &&
    student.username !== 'dimigofrontdev'
  ).map(student => 
    (({ name, serial, grade, klass, user_id, username }) => 
      ({ name, serial, grade, klass, username, idx: user_id }))(student)
  ));
});

export default router;
