import os

import slackweb


class SlackNotify:
    """
    スラック通知
    """

    def __init__(self) -> None:
        self.slack_hook_url = os.getenv("SLACK_WEBHOOK_URL")
        assert self.slack_hook_url is not None, "環境変数にSLACK_WEBHOOK_URLが設定されていません。"

    def slack_notify(self, text: str) -> None:
        """
        スラック通知
        """
        slack = slackweb.Slack(url=self.slack_hook_url)
        slack.notify(text=text)
