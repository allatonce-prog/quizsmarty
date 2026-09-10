import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, LayoutChangeEvent } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Home, ShieldAlert, UploadCloud, BarChart3, Award } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const FloatingTabBar: React.FC<any> = ({ state, descriptors, navigation, position }) => {
  const { theme, isDark } = useTheme();
  const [containerWidth, setContainerWidth] = useState<number>(Math.min(SCREEN_WIDTH * 0.92, 440));

  const slideAnim = useRef(new Animated.Value(state.index)).current;
  const scaleAnims = useRef(state.routes.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index,
      useNativeDriver: false,
      friction: 8,
      tension: 65,
    }).start();
  }, [state.index]);

  const handlePressIn = (idx: number) => {
    Animated.spring(scaleAnims[idx], {
      toValue: 0.88,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (idx: number) => {
    Animated.spring(scaleAnims[idx], {
      toValue: 1,
      friction: 4,
      tension: 45,
      useNativeDriver: true,
    }).start();
  };

  const onLayoutContainer = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) setContainerWidth(width);
  };

  const totalTabs = state.routes.length; // 5
  const slotWidth = containerWidth / totalTabs;

  // Active Pill dimensions
  const activePos = position || slideAnim;

  // Sky Blue Pill width, height & positioning interpolations
  const pillWidth = activePos.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [52, 52, 54, 52, 52],
  });

  const pillHeight = activePos.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [44, 44, 54, 44, 44],
  });

  const pillRadius = activePos.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [22, 22, 27, 22, 22],
  });

  const pillTop = activePos.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [13, 13, 8, 13, 13],
  });

  // Pixel-perfect centered X coordinates for each tab slot
  const translateX = activePos.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [
      (slotWidth - 52) / 2,
      slotWidth + (slotWidth - 52) / 2,
      slotWidth * 2 + (slotWidth - 54) / 2,
      slotWidth * 3 + (slotWidth - 52) / 2,
      slotWidth * 4 + (slotWidth - 52) / 2,
    ],
    extrapolate: 'clamp',
  });

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const isCenterUpload = routeName === 'Upload';
    const size = isCenterUpload ? 26 : 21;
    const color = isFocused ? '#FFFFFF' : isCenterUpload ? theme.skyBlue : theme.textMuted;

    switch (routeName) {
      case 'Dashboard': return <Home size={size} color={color} />;
      case 'MistakeBank': return <ShieldAlert size={size} color={color} />;
      case 'Upload': return <UploadCloud size={size} color={color} />;
      case 'Analytics': return <BarChart3 size={size} color={color} />;
      case 'Achievements': return <Award size={size} color={color} />;
      default: return <Home size={size} color={color} />;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'Dashboard': return 'Home';
      case 'MistakeBank': return 'Mistakes';
      case 'Upload': return 'Upload';
      case 'Analytics': return 'Stats';
      case 'Achievements': return 'Badges';
      default: return routeName;
    }
  };

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View
        onLayout={onLayoutContainer}
        style={[
          styles.floatingCapsule,
          {
            backgroundColor: isDark ? 'rgba(19, 30, 58, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: theme.cardBorder,
            shadowColor: theme.skyBlue,
          },
        ]}
      >
        {/* Glowing Sky Blue Pill Active Background */}
        <Animated.View
          style={[
            styles.glowingBluePill,
            {
              width: pillWidth,
              height: pillHeight,
              borderRadius: pillRadius,
              top: pillTop,
              backgroundColor: theme.skyBlue,
              shadowColor: theme.skyBlue,
              transform: [{ translateX }],
            },
          ]}
        />

        {/* Tab Buttons Row */}
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isCenterUpload = route.name === 'Upload';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options?.tabBarAccessibilityLabel}
              onPress={onPress}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              style={styles.tabSlot}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  { transform: [{ scale: scaleAnims[index] }] },
                ]}
              >
                {getTabIcon(route.name, isFocused)}
                {!isFocused && (
                  <Text style={[styles.inactiveLabel, { color: isCenterUpload ? theme.skyBlue : theme.textMuted }]}>
                    {getTabLabel(route.name)}
                  </Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  floatingCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    maxWidth: 440,
    height: 70,
    borderRadius: 35,
    paddingHorizontal: 0,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 12,
    position: 'relative',
  },
  glowingBluePill: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  tabSlot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});
