from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'id', 'name', 'username', 'email', 'password']

    def get__id(self, obj):
        return str(obj.pk)


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
        fields = ['_id', 'id', 'user', 'user_id', 'score']

    def get__id(self, obj):
        return str(obj.pk)


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['_id', 'id', 'name', 'description', 'duration']

    def get__id(self, obj):
        return str(obj.pk)
