import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
// Web-only helper exported by react-native-web
import { unstable_createElement } from 'react-native-web';

interface DateFieldProps {
  /** ISO date string: YYYY-MM-DD */
  value: string;
  onChange: (value: string) => void;
}

export function toDateObject(value: string): Date {
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function displayDate(value: string): string {
  const d = toDateObject(value);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------- Web: native HTML date input ----------
function WebDateField({ value, onChange }: DateFieldProps) {
  return unstable_createElement('input', {
    type: 'date',
    value,
    onChange: (e: { target: { value: string } }) => {
      if (e.target.value) {
        onChange(e.target.value);
      }
    },
    style: styles.webInput,
  });
}

// ---------- Android: imperative picker ----------
function AndroidDateField({ value, onChange }: DateFieldProps) {
  const open = () => {
    DateTimePickerAndroid.open({
      value: toDateObject(value),
      mode: 'date',
      onChange: (event: DateTimePickerEvent, date?: Date) => {
        if (event.type === 'set' && date) {
          onChange(toISODate(date));
        }
      },
    });
  };

  return (
    <Pressable style={styles.pill} onPress={open}>
      <Text style={styles.pillIcon}>📅</Text>
      <Text style={styles.pillText}>{displayDate(value)}</Text>
    </Pressable>
  );
}

// ---------- iOS: inline picker ----------
function IOSDateField({ value, onChange }: DateFieldProps) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => toDateObject(value));

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      setShow(false);
      return;
    }
    if (date) {
      setTempDate(date);
      onChange(toISODate(date));
    }
  };

  return (
    <View>
      <Pressable
        style={styles.pill}
        onPress={() => {
          setTempDate(toDateObject(value));
          setShow((v) => !v);
        }}
      >
        <Text style={styles.pillIcon}>📅</Text>
        <Text style={styles.pillText}>{displayDate(value)}</Text>
        <Text style={styles.pillChevron}>{show ? '▲' : '▼'}</Text>
      </Pressable>
      {show ? (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="spinner"
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
}

/** Cross-platform date picker field (web / android / ios) */
export default function DateField(props: DateFieldProps) {
  if (Platform.OS === 'web') {
    return <WebDateField {...props} />;
  }
  if (Platform.OS === 'android') {
    return <AndroidDateField {...props} />;
  }
  return <IOSDateField {...props} />;
}

const styles = StyleSheet.create({
  webInput: {
    borderWidth: 1,
    borderColor: '#d9dce3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1f2330',
    backgroundColor: '#fff',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d9dce3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    gap: 6,
  },
  pillIcon: {
    fontSize: 14,
  },
  pillText: {
    color: '#1f2330',
    fontSize: 14,
    fontWeight: '600',
  },
  pillChevron: {
    color: '#a5aab5',
    fontSize: 10,
    marginLeft: 2,
  },
});
