import {Job, JobStatus} from "../job/Job";
import { appInfo } from "../decorators/Launcher";
import { Pager, Sort } from "../common/db/DbDao";
import { logger } from "../common/util/logger";

/**
 * 使用 nedb 保存 job，用于查询回顾 job 信息
 */
export class JobManager {

    constructor() {
        this.autoReleaseLoop();
    }

    private autoReleaseLoop() {
        const autoRelease = () => {
        };
        autoRelease();
    }

    /**
     * 保存job，不存在则新增，已存在则更新
     * @param {Job} job
     * @param justUpdate
     */
    save(job: Job, skipInsert: boolean = false) {
        // return appInfo.db.save("job", job, skipInsert);
        return;
    }

    job(_id: any): Promise<Job> {
        return appInfo.db.findById("job", _id).then(doc => {
            return new Job(doc);
        });
    }

    /**
     * 分页查询job
     * @param pager
     * @returns {Promise<any>}
     */
    jobs(pager: any): Promise<any> {
        return Promise.all([
            new Promise<any>(resolve => {
                if (pager.requires && pager.requires.queues) {
                    appInfo.db.findList("job", {}, {queue: 1}).then(docs => {
                        const queues: any = {};
                        docs.forEach(doc => queues[doc.queue] = 1);
                        resolve(Object.keys(queues));
                    });
                }
                else resolve();
            }),
            new Promise<Pager>(resolve => {
                if (pager.requires && pager.requires.jobs) {
                    const tempPager = new Pager();
                    tempPager.pageSize = pager.pageSize;
                    tempPager.pageIndex = pager.pageIndex;
                    tempPager.match = pager.match;
                    tempPager.sort = {
                        createTime: -1
                    } as Sort;
                    appInfo.db.page("job", tempPager).then(pagerRes => {
                        resolve(pagerRes);
                    });
                }
                else resolve();
            })
        ] as Promise<any>[]).then(results => {
            let status = null;

            const pagerRes = results[1] || {} as any;
            return {
                success: true,
                data: {
                    total: pagerRes.total,
                    pageIndex: pagerRes.pageIndex,
                    pageSize: pagerRes.pageSize,
                    jobs: pagerRes.list,
                    queues: results[0],
                    status: status
                }
            }
        }).catch(err => {
            logger.errorValid && logger.error(err);
            return {
              success: false,
                message: err.message
            };
        });
    }


}
