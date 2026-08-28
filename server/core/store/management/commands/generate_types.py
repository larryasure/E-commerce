from django.core.management.base import BaseCommand
from django_typomatic import generate_ts
# Import your serializers so django-typomatic sees them
from store.serializers import * 

class Command(BaseCommand):
    help = 'Generates TypeScript types from Django serializers'

    def handle(self, *args, **options):
        # This will drop it cleanly right where your manage.py is!
        output_path = './api_generated.ts'
        generate_ts(output_path)
        self.stdout.write(self.style.SUCCESS(f"🎉 Success! Types generated at {output_path}"))
