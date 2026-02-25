from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating superhero users...')
        users_data = [
            # Team Marvel
            {'username': 'ironman', 'email': 'tony@avengers.com', 'password': 'stark1234'},
            {'username': 'captainamerica', 'email': 'steve@avengers.com', 'password': 'shield1234'},
            {'username': 'blackwidow', 'email': 'natasha@avengers.com', 'password': 'widow1234'},
            {'username': 'thor', 'email': 'thor@asgard.com', 'password': 'mjolnir1234'},
            {'username': 'hulk', 'email': 'bruce@avengers.com', 'password': 'smash1234'},
            # Team DC
            {'username': 'batman', 'email': 'bruce@wayneenterprises.com', 'password': 'gotham1234'},
            {'username': 'superman', 'email': 'clark@dailyplanet.com', 'password': 'krypton1234'},
            {'username': 'wonderwoman', 'email': 'diana@themyscira.com', 'password': 'lasso1234'},
            {'username': 'theflash', 'email': 'barry@ccpd.com', 'password': 'speed1234'},
            {'username': 'greenlantern', 'email': 'hal@oa.com', 'password': 'ring1234'},
        ]

        users = {}
        for data in users_data:
            user = User.objects.create(**data)
            users[data['username']] = user
            self.stdout.write(f'  Created user: {user.username}')

        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(name='Team Marvel')
        team_marvel.members.set([
            users['ironman'], users['captainamerica'], users['blackwidow'],
            users['thor'], users['hulk']
        ])

        team_dc = Team.objects.create(name='Team DC')
        team_dc.members.set([
            users['batman'], users['superman'], users['wonderwoman'],
            users['theflash'], users['greenlantern']
        ])
        self.stdout.write('  Created Team Marvel and Team DC')

        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': users['ironman'], 'activity_type': 'Flying', 'duration': 45.0, 'date': date(2024, 1, 5)},
            {'user': users['captainamerica'], 'activity_type': 'Shield Training', 'duration': 60.0, 'date': date(2024, 1, 6)},
            {'user': users['blackwidow'], 'activity_type': 'Martial Arts', 'duration': 75.0, 'date': date(2024, 1, 7)},
            {'user': users['thor'], 'activity_type': 'Hammer Throw', 'duration': 30.0, 'date': date(2024, 1, 8)},
            {'user': users['hulk'], 'activity_type': 'Smashing', 'duration': 20.0, 'date': date(2024, 1, 9)},
            {'user': users['batman'], 'activity_type': 'Cape Gliding', 'duration': 50.0, 'date': date(2024, 1, 5)},
            {'user': users['superman'], 'activity_type': 'Flying', 'duration': 90.0, 'date': date(2024, 1, 6)},
            {'user': users['wonderwoman'], 'activity_type': 'Lasso Training', 'duration': 55.0, 'date': date(2024, 1, 7)},
            {'user': users['theflash'], 'activity_type': 'Speed Running', 'duration': 15.0, 'date': date(2024, 1, 8)},
            {'user': users['greenlantern'], 'activity_type': 'Ring Constructs', 'duration': 40.0, 'date': date(2024, 1, 9)},
        ]
        for data in activities_data:
            Activity.objects.create(**data)
        self.stdout.write(f'  Created {len(activities_data)} activities')

        self.stdout.write('Creating leaderboard entries...')
        leaderboard_data = [
            {'user': users['ironman'], 'score': 950},
            {'user': users['captainamerica'], 'score': 900},
            {'user': users['blackwidow'], 'score': 870},
            {'user': users['thor'], 'score': 980},
            {'user': users['hulk'], 'score': 860},
            {'user': users['batman'], 'score': 920},
            {'user': users['superman'], 'score': 1000},
            {'user': users['wonderwoman'], 'score': 940},
            {'user': users['theflash'], 'score': 910},
            {'user': users['greenlantern'], 'score': 880},
        ]
        for data in leaderboard_data:
            Leaderboard.objects.create(**data)
        self.stdout.write(f'  Created {len(leaderboard_data)} leaderboard entries')

        self.stdout.write('Creating workouts...')
        workouts_data = [
            {'name': 'Iron Man Endurance', 'description': 'High-intensity suit flight training and repulsor target practice.', 'duration': 60},
            {'name': 'Captain America Circuit', 'description': 'Full-body shield combat and agility drills.', 'duration': 45},
            {'name': 'Black Widow Stealth Training', 'description': 'Martial arts, acrobatics, and flexibility exercises.', 'duration': 75},
            {'name': 'Thor Power Workout', 'description': 'Hammer throws, lightning resistance, and Asgardian strength training.', 'duration': 50},
            {'name': 'Hulk Smash Cardio', 'description': 'Explosive strength and anger management workout.', 'duration': 30},
            {'name': 'Batman Night Training', 'description': 'Cape gliding, batarang accuracy, and detective cardio.', 'duration': 90},
            {'name': 'Superman Speed Drill', 'description': 'Super-speed laps, heat vision focus, and flight endurance.', 'duration': 40},
            {'name': 'Wonder Woman Combat', 'description': 'Lasso technique, sword fighting, and Amazonian agility.', 'duration': 55},
            {'name': 'Flash Speed Intervals', 'description': 'Ultra-fast sprint intervals around Central City.', 'duration': 20},
            {'name': 'Green Lantern Constructs', 'description': 'Will-power ring constructs and space flight training.', 'duration': 35},
        ]
        for data in workouts_data:
            Workout.objects.create(**data)
        self.stdout.write(f'  Created {len(workouts_data)} workouts')

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
