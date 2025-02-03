import React from 'react';
import { InlineStack, Icon, Text } from '@shopify/polaris';
import { StarIcon, StarFilledIcon } from '@shopify/polaris-icons';

export function Rating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <InlineStack gap="2" align="center">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Icon key={`full-${index}`} source={StarFilledIcon} tone="success" />
      ))}

      {halfStars > 0 && <Icon source={StarIcon} tone="success" />}

      {Array.from({ length: emptyStars }).map((_, index) => (
        <Icon key={`empty-${index}`} source={StarIcon} tone="success" />
      ))}

      <Text variant="bodyMd" color="subdued">
        {rating}
      </Text>
    </InlineStack>
  );
}

