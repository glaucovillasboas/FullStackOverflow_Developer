import { Request, Response, NextFunction } from 'express';
import { statusCode } from '../enums/httpStatus';
import { AppResponse } from '../interfaces/appResponse.interface';
import * as questionSchema from '../schemas/question.schema';
import * as questionService from '../services/question.service';

const createQuestion = async (req: Request, res: Response, next: NextFunction)
  : Promise<AppResponse> => {
  if (questionSchema.createQuestion.validate(req.body).error) {
    return res.sendStatus(statusCode.BAD_REQUEST);
  }

  const { question, student, tags } = req.body;
  const userClass = req.body.class;

  try {
    const createdQuestion = await questionService
      .createQuestion({
        question,
        student,
        class: userClass,
        tags,
      });

    return res.send(createdQuestion);
  } catch (error) {
    if (error.name === 'QuestionError') {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }

    next(error);
  }
};

const findQuestionById = async (req: Request, res: Response, next: NextFunction)
  : Promise<AppResponse> => {
  if (questionSchema.findQuestionById.validate(req.params).error) {
    return res.sendStatus(statusCode.BAD_REQUEST);
  }

  const { id } = req.params;

  try {
    const createdQuestion = await questionService
      .findQuestionById(Number(id));

    return res.send(createdQuestion);
  } catch (error) {
    if (error.name === 'QuestionError') {
      return res.status(statusCode.NOT_FOUND).send(error.message);
    }

    next(error);
  }
};
export {
  createQuestion,
  findQuestionById,
};
