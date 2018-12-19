USE [LaunchpadFrame]
GO

/****** Object:  Table [dbo].[FrameSettings]    Script Date: 12/19/2018 3:00:39 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FrameSettings](
	[Id] [int] NOT NULL,
	[FrameId] [int] NOT NULL,
	[IsPublic] [bit] NOT NULL,
	[IsReadOnly] [bit] NOT NULL,
 CONSTRAINT [PK_FrameSettings] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[FrameSettings]  WITH CHECK ADD  CONSTRAINT [FK_FrameSettings_Frames] FOREIGN KEY([FrameId])
REFERENCES [dbo].[Frames] ([Id])
GO

ALTER TABLE [dbo].[FrameSettings] CHECK CONSTRAINT [FK_FrameSettings_Frames]
GO

