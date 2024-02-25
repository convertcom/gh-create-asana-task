import * as core from "@actions/core";
import asana from "asana";

/* Edit Function */
const run = async (): Promise<void> => {
  try {
    const token = core.getInput("asana-secret", { required: true });
    core.setSecret(token);
    const client = asana.Client.create({
      defaultHeaders: {
        "asana-enable": "new_project_templates,new_user_task_lists",
      },
    }).useAccessToken(token);

    const workspaceId = core.getInput("asana-workspace-id", { required: true });
    const projectId = core.getInput("asana-project-id", { required: true });
    const sectionId = core.getInput("asana-section-id", { required: true });
    const taskName = core.getInput("asana-task-name", { required: true });
    const taskDescription = core.getInput("asana-task-description");
    const dueDate = core.getInput("asana-due-date");
    const tags = core.getInput("asana-tags");

    //  const assignee = await getAssignee();

    const result = await client.tasks.create({
      workspace: workspaceId,
      projects: [projectId],
      memberships: [{ project: projectId, section: sectionId }],
      name: taskName,
      notes: taskDescription,
      due_on: dueDate,
      tags: tags ? JSON.parse(tags) : "",
    });
    console.log(result);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) core.setFailed(error.message);
  }
};

// const getAssignee = async (): Promise<string | undefined> => {
//   let assignee;

//   const githubToken = core.getInput("github-token");
//   const octokit = github.getOctokit(githubToken);
//   const commitSha =
//     github.context.payload.pull_request?.head.sha ?? github.context.sha;
//   const { data: commit } = await octokit.rest.git.getCommit({
//     commit_sha: commitSha,
//     owner: github.context.repo.owner,
//     repo: github.context.repo.repo,
//   });

//   return assignee;
// };

run();
