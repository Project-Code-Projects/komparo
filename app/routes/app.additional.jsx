import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import "../styles/pastel.colors.css";
import LineChartGraph from "../components/LineChart";
import BarChartGraph from "../components/BarChart";

export default function AdditionalPage() {
  return (
<>
<Page>
<TitleBar title="Additional page" />
<Layout>
  <Layout.Section>
    <Card>
      <BlockStack gap="300">
        <Text as="p" variant="bodyMd">
          The app template comes with an additional page which
          demonstrates how to create multiple pages within app navigation
          using{" "}
          <Link
            url="https://shopify.dev/docs/apps/tools/app-bridge"
            target="_blank"
            removeUnderline
            className="pastel-green"
          >
            App Bridge
          </Link>
          .
        </Text>
        <Text as="p" variant="bodyMd" className="pastel-yellow">
          To create your own page and have it show up in the app
          navigation, add a page inside <Code color="pastel-pink">app/routes</Code>, and a
          link to it in the <Code color="pastel-purple">&lt;NavMenu&gt;</Code> component found
          in <Code>app/routes/app.jsx</Code>.
        </Text>
      </BlockStack>
    </Card>
  </Layout.Section>
  <Layout.Section variant="oneThird">
    <Card className="pastel-purple"> 
      <BlockStack gap="200">
        <Text as="h2" variant="headingMd" className="pastel-pink">
          Resources
        </Text>
        <List>
          <List.Item>
            <Link
              url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
              target="_blank"
              removeUnderline
              className="pastel-blue"
            >
              App nav best practices
            </Link>
          </List.Item>
        </List>
      </BlockStack>
    </Card>
  </Layout.Section>
</Layout>
</Page>
<LineChartGraph />
<BarChartGraph />
</>
  );
}
  // <div><ChartComponent /></div>
function Code({ children, color = "pastel-green" }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
      className={color}
    >
      <code>{children}</code>
    </Box>
  );
}
