from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    team_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['_id', 'id', 'name', 'username', 'email', 'password', 'team', 'team_id']

    def get__id(self, obj):
        return str(obj.pk)

    def get_team(self, obj):
        team = obj.teams.first()
        if team:
            return {'id': team.pk, 'name': team.name}
        return None

    def update(self, instance, validated_data):
        team_id = validated_data.pop('team_id', -1)
        instance = super().update(instance, validated_data)
        if team_id != -1:
            # Remove from all current teams
            for t in instance.teams.all():
                t.members.remove(instance)
            # Add to new team if provided
            if team_id is not None:
                from .models import Team as TeamModel
                try:
                    new_team = TeamModel.objects.get(pk=team_id)
                    new_team.members.add(instance)
                except TeamModel.DoesNotExist:
                    pass
        return instance


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['_id', 'id', 'name', 'members']

    def get__id(self, obj):
        return str(obj.pk)


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = Activity
        fields = ['_id', 'id', 'user', 'user_id', 'activity_type', 'duration', 'date']

    def get__id(self, obj):
        return str(obj.pk)


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = Leaderboard
        fields = ['_id', 'id', 'user', 'user_id', 'score', 'team', 'total_calories']

    def get__id(self, obj):
        return str(obj.pk)


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    participant = UserSerializer(read_only=True)
    participant_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='participant', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Workout
        fields = ['_id', 'id', 'name', 'description', 'duration', 'difficulty', 'participant', 'participant_id']

    def get__id(self, obj):
        return str(obj.pk)
