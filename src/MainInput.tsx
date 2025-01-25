import { ActionIcon, Box, Textarea, Text, Group, Avatar } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCopy } from '@tabler/icons-react';
import { use, useEffect, useRef, useState } from 'react';
import autocompleteText from './common/autocomplete';
import Icon from '../public/favicon.png';

export default function MainInput() {
  const [value, setValue] = useState('');
  const [debouncedValue] = useDebouncedValue(value, 500);
  const [prev, setPrev] = useState<Map<string, string[]>>(new Map());
  const completing = useRef(false);

  useEffect(() => {
    const value = debouncedValue.trim();
    if (!value || completing.current) return;
    completing.current = true;
    autocompleteText(value, prev.get(value) ?? [])
      .then((r) => {
        if (r) {
          setValue(r.result);

          // Update previous completions
          const prevCompletions = prev.get(value) ?? [];
          prevCompletions.push(r.generated);
          setPrev(new Map(prev.set(value, prevCompletions)));
        }
        completing.current = false;
      })
      .catch((error) => {
        console.error(error);
      });
  }, [debouncedValue]);

  return (
    <Box
      style={{
        position: 'relative',
      }}
    >
      <ActionIcon
        variant='subtle'
        aria-label='Copy'
        color='teal'
        radius='lg'
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 100,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        onClick={() => {
          navigator.clipboard.writeText(value);
        }}
      >
        <IconCopy style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
      <Group h={50} align='center' gap={0}>
        <Avatar src={Icon} alt='Autocomplete Icon' size={30} m={10} />
        <Text fz='h2' pb={3}>
          Quzzar's Autocomplete
        </Text>
      </Group>
      <Textarea
        size='lg'
        placeholder='Your text here...'
        styles={{
          input: {
            height: 'calc(100dvh - 50px)',
          },
        }}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </Box>
  );
}
