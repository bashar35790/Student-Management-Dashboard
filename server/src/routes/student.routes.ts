import { Router } from 'express'
import { validate } from '../middleware/validate.js'
import {
  createStudentHandler,
  deleteStudentHandler,
  getStudentHandler,
  listStudentsHandler,
  updateStudentHandler,
} from '../services/student/controller.js'
import {
  createStudentSchema,
  studentParamsSchema,
  studentQuerySchema,
  updateStudentSchema,
} from '../services/student/schema.js'

const router = Router()

router.get('/', validate({ query: studentQuerySchema }), listStudentsHandler)
router.get('/:id', validate({ params: studentParamsSchema }), getStudentHandler)
router.post('/', validate({ body: createStudentSchema }), createStudentHandler)
router.patch(
  '/:id',
  validate({ params: studentParamsSchema, body: updateStudentSchema }),
  updateStudentHandler,
)
router.delete('/:id', validate({ params: studentParamsSchema }), deleteStudentHandler)

export default router