import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { envConfig } from '../../../../env';
import { useUser } from '@/hooks/use-user';

interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  role?: string;
  gender?: string;
  phone?: string;
  city?: string;
  country?: string;
}

interface AccountInfoProps {
  profile: Profile | null;
}

export function AccountInfo({ profile }: AccountInfoProps): React.JSX.Element {
  const [avatar, setAvatar] = React.useState<string | undefined>(profile?.avatar);
  const [isUploading, setIsUploading] = React.useState(false);
  const { user } = useUser();

  React.useEffect(() => {
    if (profile?.avatar) {
      setAvatar(profile.avatar);
    }
  }, [profile?.avatar]);
  

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append('avatar', event.target.files[0]);
      setIsUploading(true);

      try {
        const response = await fetch(`${envConfig.url}/upload-profilePic`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`, 
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload avatar');
        }

        setAvatar(data.avatar);
        
      } catch (error) {
        console.error('Error uploading avatar:', error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            {isUploading ? (
              <CircularProgress sx={{ height: '80px', width: '80px' }} />
            ) : (
              <Avatar src={avatar} sx={{ height: '80px', width: '80px' }} />
            )}
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{`${profile.firstName} ${profile.lastName}`}</Typography>
            <Typography color="text.secondary" variant="body2">
              {profile?.city} {profile?.country}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {profile?.role}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button component="label" fullWidth variant="text" disabled={isUploading}>
          {isUploading ? <CircularProgress size={24} /> : 'Upload picture'}
          <input type="file" hidden onChange={handleUpload} />
        </Button>
      </CardActions>
    </Card>
  );
}
