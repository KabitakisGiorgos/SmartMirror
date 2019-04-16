import { Request, Response } from 'express';
import News from './news.model';
import * as schedule from 'node-schedule';
import axios from 'axios';
import { async } from 'rxjs/internal/scheduler/async';

function respondWithResult(res: Response, statusCode: number) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function handleError(res: Response, statusCode: number) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

class NewsController {

    constructor() {
        var rule = new schedule.RecurrenceRule();
        rule.hour = 15;
        rule.minute = 32;
        rule.datOfWeek = new schedule.Range(0, 6);

        schedule.scheduleJob(rule, () => {
            this.retrieveNews();
            console.log('Schedule Job Run');
        });
    }

    public index(req: Request, res: Response) {
        return News.find().exec()
            .then(respondWithResult(res, 200))
            .catch(handleError(res, 500));
    }

    public retrieveNews() {//Retrieving "fresh" news
        News.collection.drop();
        let url = 'https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=abbee428fc094ecd912c50d91781d817';
        axios.get(url)
            .then((response: any) => {
                var data = response.data;
                for (let i = 0; i < data.articles.length; i++) {
                    News.create(data.articles[i]);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export default new NewsController();