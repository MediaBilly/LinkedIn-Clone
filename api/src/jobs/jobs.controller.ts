import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JobAlertDto } from './dto/job-alert.dto';
import { JobApplicationDto } from './dto/job-application.dto';
import { IsJobAlertCreatorGuard } from './guards/is-job-alert-creator.guard';
import { IsJobApplicationsAlertCreatorGuard } from './guards/is-job-applications-alert-creator.guard';
import { IsNotJobAlertCreatorGuard } from './guards/is-not-job-alert-creator.guard copy';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {

    constructor(private readonly jobsService: JobsService) {}

    // Basic functionality

    @UseGuards(JwtAuthGuard)
    @Get()
    getRecommendedJobAlerts(@Request() req, @Query('q') q: string) {
        if (q) {
            return this.jobsService.find(q);
        } else {
            return this.jobsService.getRecommendedJobAlerts(+req.user.id);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('mine')
    getMyJobAlerts(@Request() req) {
        return this.jobsService.getUserJobAlerts(+req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getJobAlert(@Param('id') id: string) {
        return this.jobsService.findJobAlert(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createJobAlert(@Request() req, @Body() jobAlertDto: JobAlertDto) {
        return this.jobsService.createJobAlert(+req.user.id, jobAlertDto);
    }

    @UseGuards(JwtAuthGuard, IsJobAlertCreatorGuard)
    @Delete(':id')
    deleteJobAlert(@Param('id') id: string) {
        return this.jobsService.deleteJobAlert(+id);
    }

    // User applications

    @UseGuards(JwtAuthGuard, IsJobAlertCreatorGuard)
    @Get(':id/applications')
    getJobApplications(@Param('id') id: string) {
        return this.jobsService.getJobApplications(+id);
    }

    @UseGuards(JwtAuthGuard, IsJobApplicationsAlertCreatorGuard)
    @Patch('applications/:id/accept')
    acceptUserApplication(@Param('id') id: string) {
        return this.jobsService.acceptUserApplication(+id);
    }

    @UseGuards(JwtAuthGuard, IsJobApplicationsAlertCreatorGuard)
    @Patch('applications/:id/decline')
    declineUserApplication(@Param('id') id: string) {
        return this.jobsService.declineUserApplication(+id);
    }

    @UseGuards(JwtAuthGuard, IsNotJobAlertCreatorGuard)
    @Post(':id/applications')
    userApply(@Request() req, @Param('id') id: string,@Body() jobApplicationDto: JobApplicationDto) {
        return this.jobsService.userApply(+req.user.id, +id, jobApplicationDto);
    }
}
